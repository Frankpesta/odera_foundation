"use server";

import { executeQuery } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define the Event type based on our database schema
export type Event = {
	id: number;
	title: string;
	slug: string;
	description: string;
	content?: string;
	location: string;
	event_date: Date;
	event_end_date?: Date;
	image_url?: string;
	category_id?: number;
	status: "draft" | "published" | "cancelled" | "completed";
	is_featured: boolean;
	created_by?: number;
	created_at: Date;
	updated_at: Date;
	seo_metadata?: any;
	images?: EventImage[];
};

// Define the EventImage type
export type EventImage = {
	id: number;
	event_id: number;
	image_url: string;
	alt_text?: string;
	is_featured: boolean;
	display_order: number;
	created_at: Date;
};

// Define the EventCategory type
export type EventCategory = {
	id: number;
	name: string;
	slug: string;
	description?: string;
	created_at: Date;
};

// Validation schema for event creation/update
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
	event_date: z.string().transform((str) => new Date(str)),
	event_end_date: z
		.string()
		.optional()
		.transform((str) => (str ? new Date(str) : undefined)),
	image_url: z.string().url().optional(),
	category_id: z.number().optional(),
	status: z.enum(["draft", "published", "cancelled", "completed"]),
	is_featured: z.boolean().default(false),
	images: z.array(z.string()).optional(),
	seo_metadata: z.record(z.any()).optional(),
});

export type EventFormData = z.infer<typeof eventSchema>;

// Get all events
export async function getEvents(
	options: {
		status?: string;
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

	let query = `
    SELECT e.*, c.name as category_name 
    FROM events e
    LEFT JOIN event_categories c ON e.category_id = c.id
    WHERE 1=1
  `;

	const params: any[] = [];

	if (status) {
		query += ` AND e.status = $${params.length + 1}`;
		params.push(status);
	}

	if (featured !== undefined) {
		query += ` AND e.is_featured = $${params.length + 1}`;
		params.push(featured);
	}

	if (categoryId) {
		query += ` AND e.category_id = $${params.length + 1}`;
		params.push(categoryId);
	}

	if (upcoming) {
		query += ` AND e.event_date >= NOW()`;
	} else if (upcoming === false) {
		query += ` AND e.event_date < NOW()`;
	}

	query += ` ORDER BY e.event_date ${upcoming ? "ASC" : "DESC"}`;

	// Add pagination if not using limit
	if (!limit) {
		const offset = (page - 1) * pageSize;
		query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
		params.push(pageSize, offset);
	} else {
		query += ` LIMIT $${params.length + 1}`;
		params.push(limit);
	}

	const events = await executeQuery<Event[]>(query, params);

	// Fetch images for each event
	for (const event of events) {
		event.images = await getEventImages(event.id);
	}

	return events;
}

// Get event count for pagination
export async function getEventCount(
	options: {
		status?: string;
		featured?: boolean;
		categoryId?: number;
		upcoming?: boolean;
	} = {}
) {
	const { status, featured, categoryId, upcoming } = options;

	let query = `
    SELECT COUNT(*) as count
    FROM events e
    WHERE 1=1
  `;

	const params: any[] = [];

	if (status) {
		query += ` AND e.status = $${params.length + 1}`;
		params.push(status);
	}

	if (featured !== undefined) {
		query += ` AND e.is_featured = $${params.length + 1}`;
		params.push(featured);
	}

	if (categoryId) {
		query += ` AND e.category_id = $${params.length + 1}`;
		params.push(categoryId);
	}

	if (upcoming) {
		query += ` AND e.event_date >= NOW()`;
	} else if (upcoming === false) {
		query += ` AND e.event_date < NOW()`;
	}

	const result = await executeQuery<[{ count: string }]>(query, params);
	return Number.parseInt(result[0].count);
}

// Get a single event by slug
export async function getEventBySlug(slug: string) {
	const query = `
    SELECT e.*, c.name as category_name 
    FROM events e
    LEFT JOIN event_categories c ON e.category_id = c.id
    WHERE e.slug = $1
  `;

	const events = await executeQuery<Event[]>(query, [slug]);

	if (events.length === 0) {
		return null;
	}

	const event = events[0];

	// Fetch images for the event
	event.images = await getEventImages(event.id);

	return event;
}

// Get images for an event
export async function getEventImages(eventId: number) {
	const query = `
    SELECT * FROM event_images
    WHERE event_id = $1
    ORDER BY is_featured DESC, display_order ASC
  `;

	return executeQuery<EventImage[]>(query, [eventId]);
}

// Get all event categories
export async function getEventCategories() {
	return executeQuery<EventCategory[]>(
		"SELECT * FROM event_categories ORDER BY name"
	);
}

// Create a new event
export async function createEvent(data: EventFormData) {
	try {
		// Validate the input data
		const validatedData = eventSchema.parse(data);

		// Start a transaction
		await executeQuery("BEGIN");

		// Create the event
		const query = `
      INSERT INTO events (
        title, slug, description, content, location, 
        event_date, event_end_date, image_url, category_id, 
        status, is_featured, created_by, seo_metadata
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *
    `;

		const seoMetadata = {
			title: validatedData.title,
			description: validatedData.description.substring(0, 160),
			type: "event",
		};

		const params = [
			validatedData.title,
			validatedData.slug,
			validatedData.description,
			validatedData.content || null,
			validatedData.location,
			validatedData.event_date,
			validatedData.event_end_date || null,
			validatedData.image_url || null,
			validatedData.category_id || null,
			validatedData.status,
			validatedData.is_featured,
			1, // Default admin user ID
			JSON.stringify(seoMetadata),
		];

		const result = await executeQuery<Event[]>(query, params);
		const event = result[0];

		// Add images if provided
		if (validatedData.images && validatedData.images.length > 0) {
			await addEventImages(event.id, validatedData.images);
		}

		// Commit the transaction
		await executeQuery("COMMIT");

		// Revalidate the events pages
		revalidatePath("/events");
		revalidatePath("/admin/events");

		return { success: true, event };
	} catch (error) {
		// Rollback the transaction on error
		await executeQuery("ROLLBACK");

		console.error("Error creating event:", error);
		return {
			success: false,
			error:
				error instanceof z.ZodError ? error.errors : "Failed to create event",
		};
	}
}

// Update an existing event
export async function updateEvent(id: number, data: EventFormData) {
	try {
		// Validate the input data
		const validatedData = eventSchema.parse(data);

		// Start a transaction
		await executeQuery("BEGIN");

		const query = `
      UPDATE events
      SET 
        title = $1,
        slug = $2,
        description = $3,
        content = $4,
        location = $5,
        event_date = $6,
        event_end_date = $7,
        image_url = $8,
        category_id = $9,
        status = $10,
        is_featured = $11,
        updated_at = NOW(),
        seo_metadata = $12
      WHERE id = $13
      RETURNING *
    `;

		const seoMetadata = {
			title: validatedData.title,
			description: validatedData.description.substring(0, 160),
			type: "event",
		};

		const params = [
			validatedData.title,
			validatedData.slug,
			validatedData.description,
			validatedData.content || null,
			validatedData.location,
			validatedData.event_date,
			validatedData.event_end_date || null,
			validatedData.image_url || null,
			validatedData.category_id || null,
			validatedData.status,
			validatedData.is_featured,
			JSON.stringify(seoMetadata),
			id,
		];

		const result = await executeQuery<Event[]>(query, params);
		const event = result[0];

		// Update images if provided
		if (validatedData.images) {
			// First, delete existing images
			await executeQuery("DELETE FROM event_images WHERE event_id = $1", [id]);

			// Then add new images
			if (validatedData.images.length > 0) {
				await addEventImages(id, validatedData.images);
			}
		}

		// Commit the transaction
		await executeQuery("COMMIT");

		// Revalidate the events pages
		revalidatePath("/events");
		revalidatePath("/admin/events");
		revalidatePath(`/events/${validatedData.slug}`);

		return { success: true, event };
	} catch (error) {
		// Rollback the transaction on error
		await executeQuery("ROLLBACK");

		console.error("Error updating event:", error);
		return {
			success: false,
			error:
				error instanceof z.ZodError ? error.errors : "Failed to update event",
		};
	}
}

// Add images to an event
async function addEventImages(eventId: number, imageUrls: string[]) {
	for (let i = 0; i < imageUrls.length; i++) {
		const query = `
      INSERT INTO event_images (
        event_id, image_url, is_featured, display_order
      )
      VALUES ($1, $2, $3, $4)
    `;

		const params = [
			eventId,
			imageUrls[i],
			i === 0, // First image is featured
			i,
		];

		await executeQuery(query, params);
	}
}

// Delete an event
export async function deleteEvent(id: number) {
	try {
		// Start a transaction
		await executeQuery("BEGIN");

		// Delete event images first (cascade will handle this, but being explicit)
		await executeQuery("DELETE FROM event_images WHERE event_id = $1", [id]);

		// Delete the event
		const query = "DELETE FROM events WHERE id = $1 RETURNING *";
		const result = await executeQuery<Event[]>(query, [id]);

		// Commit the transaction
		await executeQuery("COMMIT");

		// Revalidate the events pages
		revalidatePath("/events");
		revalidatePath("/admin/events");

		return { success: true, event: result[0] };
	} catch (error) {
		// Rollback the transaction on error
		await executeQuery("ROLLBACK");

		console.error("Error deleting event:", error);
		return { success: false, error: "Failed to delete event" };
	}
}

// Register for an event
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
		const query = `
      INSERT INTO event_registrations (
        event_id, name, email, phone, notes
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

		const params = [
			eventId,
			data.name,
			data.email,
			data.phone || null,
			data.notes || null,
		];

		const result = await executeQuery(query, params);

		return { success: true, registration: result[0] };
	} catch (error) {
		console.error("Error registering for event:", error);
		return { success: false, error: "Failed to register for event" };
	}
}
