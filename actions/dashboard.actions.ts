"use server";

import { db } from "@/db/db";
import { z } from "zod";
import { events, eventCategories, eventImages } from "@/db/schema";
import { and, eq, gte, lt, asc, desc } from "drizzle-orm";

export type DashboardStats = {
	totalEvents: number;
	upcomingEvents: number;
	publishedEvents: number;
	featuredEvents: number;
};

export type DashboardEventPreview = {
	id: number;
	title: string;
	slug: string;
	status: string;
	event_date: Date;
	image_url: string | null;
	category_name: string | null;
};

// Helper: count records
async function countEvents(
	filters: {
		status?: "draft" | "published" | "cancelled" | "completed";
		featured?: boolean;
		upcoming?: boolean;
	} = {}
) {
	let query = db.select({ id: events.id }).from(events).$dynamic();

	if (filters.status) {
		query = query.where(eq(events.status, filters.status));
	}

	if (filters.featured !== undefined) {
		query = query.where(eq(events.isFeatured, filters.featured));
	}

	if (filters.upcoming !== undefined) {
		query = query.where(
			filters.upcoming
				? gte(events.eventDate, new Date())
				: lt(events.eventDate, new Date())
		);
	}

	const result = await query;
	return result.length;
}

// Get dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
	const [totalEvents, upcomingEvents, publishedEvents, featuredEvents] =
		await Promise.all([
			countEvents(),
			countEvents({ upcoming: true }),
			countEvents({ status: "published" }),
			countEvents({ featured: true }),
		]);

	return {
		totalEvents,
		upcomingEvents,
		publishedEvents,
		featuredEvents,
	};
}

// Get recent events for dashboard
export async function getRecentDashboardEvents(
	limit = 5
): Promise<DashboardEventPreview[]> {
	const rows = await db
		.select({
			id: events.id,
			title: events.title,
			slug: events.slug,
			status: events.status,
			event_date: events.eventDate,
			image_url: events.imageUrl,
			category_name: eventCategories.name,
		})
		.from(events)
		.leftJoin(eventCategories, eq(events.categoryId, eventCategories.id))
		.orderBy(desc(events.createdAt))
		.limit(limit);

	return rows.map((event) => ({
		...event,
	}));
}
