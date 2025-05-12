"use server";

import { db } from "@/db/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
	events,
	eventImages,
	eventCategories,
	eventRegistrations,
	type Event,
	type EventImage,
	type EventCategory,
} from "@/db/schema";
import { and, eq, gt, lt, gte, lte, asc, desc, sql } from "drizzle-orm";

export type { Event as EventType };
export type { EventImage as EventImageType };
export type { EventCategory as EventCategoryType };

// Validation schema remains the same
const eventSchema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters"),
	slug: z
		.string()
		.min(3, "Slug must be at least 3 characters")
		.regex(
			/^[a-z0-9-]+$/,
			"Slug can only contain lowercase letters, numbers, and hyphens"
		),
	description: z.string().min(10, "Description must be at least 10 characters"),
	content: z.string().optional(),
	location: z.string().min(3, "Location must be at least 3 characters"),
	event_date: z.union([z.string(), z.date()]).transform((val) => {
		if (typeof val === "string") return new Date(val);
		return val;
	}),
	event_end_date: z.union([z.string(), z.date()]).transform((val) => {
		if (typeof val === "string") return new Date(val);
		return val;
	}),
	image_url: z.string().url().optional(),
	category_id: z.number().optional(),
	status: z.enum(["draft", "published", "cancelled", "completed"]),
	is_featured: z.boolean().default(false),
	images: z.array(z.string()).optional(),
	seo_metadata: z.record(z.any()).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

// Get all events with Drizzle
export async function getEvents(
	options: {
		status?: "draft" | "published" | "cancelled" | "completed";
		limit?: number;
		featured?: boolean;
		categoryId?: number;
		upcoming?: boolean;
		page?: number;
		pageSize?: number;
	} = {}
) {
	const {
		status,
		limit,
		featured,
		categoryId,
		upcoming,
		page = 1,
		pageSize = 10,
	} = options;

	const query = db
		.select({
			...getEventFields(),
			category_name: eventCategories.name,
		})
		.from(events)
		.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
		.$dynamic();

	// Apply filters
	if (status) {
		query.where(eq(events.status, status));
	}

	if (featured !== undefined) {
		query.where(eq(events.isFeatured, featured));
	}

	if (categoryId) {
		query.where(eq(events.categoryId, categoryId));
	}

	if (upcoming !== undefined) {
		query.where(
			upcoming
				? gte(events.eventDate, new Date())
				: lt(events.eventDate, new Date())
		);
	}

	// Apply sorting
	query.orderBy(upcoming ? asc(events.eventDate) : desc(events.eventDate));

	// Apply pagination
	if (!limit) {
		const offset = (page - 1) * pageSize;
		query.limit(pageSize).offset(offset);
	} else {
		query.limit(limit);
	}

	const result = await query;

	// Fetch images for each event
	// Use the actual result type from the query, not the column definitions
	type EventWithCategory = {
		[K in keyof ReturnType<typeof getEventFields>]: any;
	} & { category_name: string | null };

	type EventWithImages = EventWithCategory & {
		images: Awaited<ReturnType<typeof getEventImages>>;
	};

	const eventsWithImages: EventWithImages[] = await Promise.all(
		result.map(async (event) => ({
			...event,
			images: await getEventImages(event.id as number),
		}))
	);

	return eventsWithImages;
}

// Get event count with Drizzle
export async function getEventCount(
	options: {
		status?: "draft" | "published" | "cancelled" | "completed";
		featured?: boolean;
		categoryId?: number;
		upcoming?: boolean;
	} = {}
) {
	const { status, featured, categoryId, upcoming } = options;

	const query = db
		.select({ count: sql<number>`count(*)` })
		.from(events)
		.$dynamic();

	// Apply filters
	if (status) {
		query.where(eq(events.status, status));
	}

	if (featured !== undefined) {
		query.where(eq(events.isFeatured, featured));
	}

	if (categoryId) {
		query.where(eq(events.categoryId, categoryId));
	}

	if (upcoming !== undefined) {
		query.where(
			upcoming
				? gte(events.eventDate, new Date())
				: lt(events.eventDate, new Date())
		);
	}

	const result = await query;
	return result[0].count;
}

// Get a single event by slug with Drizzle
export async function getEventBySlug(slug: string) {
	const result = await db
		.select({
			...getEventFields(),
			category_name: eventCategories.name,
		})
		.from(events)
		.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
		.where(eq(events.slug, slug));

	if (result.length === 0) {
		return null;
	}

	const event = result[0];
	const images = await getEventImages(event.id);
	return { ...event, images };
}

// Get images for an event with Drizzle
export async function getEventImages(eventId: number) {
	return db
		.select()
		.from(eventImages)
		.where(eq(eventImages.eventId, eventId))
		.orderBy(desc(eventImages.isFeatured), asc(eventImages.displayOrder));
}

// Get all event categories with Drizzle
export async function getEventCategories() {
	return db.select().from(eventCategories).orderBy(asc(eventCategories.name));
}

// Create a new event with Drizzle (without transaction)
export async function createEvent(data: EventFormData) {
	try {
		const processedData = {
			...data,
			event_date:
				data.event_date instanceof Date
					? data.event_date.toISOString()
					: data.event_date,
			event_end_date:
				data.event_end_date instanceof Date
					? data.event_end_date.toISOString()
					: data.event_end_date,
		};

		const validatedData = eventSchema.parse(processedData);

		interface SeoMetadata {
			title: string;
			description: string;
			type: string;
		}

		const seoMetadata: SeoMetadata = {
			title: validatedData.title,
			description: validatedData.description.substring(0, 160),
			type: "event",
		};

		// Create the event
		const [event] = await db
			.insert(events)
			.values({
				title: validatedData.title,
				slug: validatedData.slug,
				description: validatedData.description,
				content: validatedData.content || null,
				location: validatedData.location,
				eventDate: validatedData.event_date,
				eventEndDate: validatedData.event_end_date || null,
				imageUrl: Array.isArray(validatedData.image_url)
					? validatedData.image_url[0] || null
					: validatedData.image_url || null,
				categoryId: validatedData.category_id || null,
				status: validatedData.status,
				isFeatured: validatedData.is_featured,
				createdBy: 1, // Default admin user ID
				seoMetadata: seoMetadata,
			})
			.returning();

		// Add images if provided
		if (validatedData.images && validatedData.images.length > 0) {
			await addEventImages(db, event.id as number, validatedData.images);
		}

		// Revalidate paths
		revalidatePath("/events");
		revalidatePath("/admin/events");

		return { success: true, event };
	} catch (error) {
		console.error("Error creating event:", error);
		return {
			success: false,
			error:
				error instanceof z.ZodError ? error.errors : "Failed to create event",
		};
	}
}

// Update an existing event with Drizzle (without transaction)
export async function updateEvent(id: number, data: EventFormData) {
	try {
		const validatedData = eventSchema.parse(data);

		interface SeoMetadata {
			title: string;
			description: string;
			type: string;
		}

		const seoMetadata: SeoMetadata = {
			title: validatedData.title,
			description: validatedData.description.substring(0, 160),
			type: "event",
		};

		// Update the event
		const [event] = await db
			.update(events)
			.set({
				title: validatedData.title,
				slug: validatedData.slug,
				description: validatedData.description,
				content: validatedData.content || null,
				location: validatedData.location,
				eventDate: validatedData.event_date,
				eventEndDate: validatedData.event_end_date || null,
				imageUrl: validatedData.image_url || null,
				categoryId: validatedData.category_id || null,
				status: validatedData.status,
				isFeatured: validatedData.is_featured,
				updatedAt: new Date(),
				seoMetadata: seoMetadata,
			})
			.where(eq(events.id, id))
			.returning();

		// Update images if provided
		if (validatedData.images) {
			// Delete existing images
			await db.delete(eventImages).where(eq(eventImages.eventId, id));

			// Add new images
			if (validatedData.images.length > 0) {
				await addEventImages(db, id, validatedData.images);
			}
		}

		// Revalidate paths
		revalidatePath("/events");
		revalidatePath("/admin/events");
		revalidatePath(`/events/${validatedData.slug}`);

		return { success: true, event };
	} catch (error) {
		console.error("Error updating event:", error);
		return {
			success: false,
			error:
				error instanceof z.ZodError ? error.errors : "Failed to update event",
		};
	}
}

// Helper to add event images with Drizzle (modified to not expect transaction)
// Updated helper function
async function addEventImages(
	dbClient: typeof db,
	eventId: number,
	imageUrls: string[]
) {
	// First image becomes the main image_url
	const mainImageUrl = imageUrls[0] || null;

	// Update the event's image_url with the first image
	await dbClient
		.update(events)
		.set({ imageUrl: mainImageUrl })
		.where(eq(events.id, eventId));

	// Add all images to event_images
	await Promise.all(
		imageUrls.map((url, index) =>
			dbClient.insert(eventImages).values({
				eventId,
				imageUrl: url,
				isFeatured: index === 0,
				displayOrder: index,
			})
		)
	);
}

// Delete an event with Drizzle (without transaction)
export async function deleteEvent(id: number) {
	try {
		// Delete the event (images will cascade)
		const [event] = await db
			.delete(events)
			.where(eq(events.id, id))
			.returning();

		// Revalidate paths
		revalidatePath("/events");
		revalidatePath("/admin/events");

		return { success: true, event };
	} catch (error) {
		console.error("Error deleting event:", error);
		return { success: false, error: "Failed to delete event" };
	}
}

// Register for an event with Drizzle
export async function registerForEvent(
	eventId: number,
	data: {
		name: string;
		email: string;
		phone?: string;
		notes?: string;
	}
) {
	try {
		const [registration] = await db
			.insert(eventRegistrations)
			.values({
				eventId,
				name: data.name,
				email: data.email,
				phone: data.phone || null,
				notes: data.notes || null,
			})
			.returning();

		return { success: true, registration };
	} catch (error) {
		console.error("Error registering for event:", error);
		return { success: false, error: "Failed to register for event" };
	}
}

// Helper function to select event fields
function getEventFields() {
	return {
		id: events.id,
		title: events.title,
		slug: events.slug,
		description: events.description,
		content: events.content,
		location: events.location,
		event_date: events.eventDate,
		event_end_date: events.eventEndDate,
		image_url: events.imageUrl,
		category_id: events.categoryId,
		status: events.status,
		is_featured: events.isFeatured,
		created_by: events.createdBy,
		created_at: events.createdAt,
		updated_at: events.updatedAt,
		seo_metadata: events.seoMetadata,
	};
}
