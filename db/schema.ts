// src/db/schema.ts
import {
	pgTable,
	serial,
	text,
	timestamp,
	integer,
	boolean,
	jsonb,
	primaryKey,
	varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const eventCategories = pgTable("event_categories", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }), // Store hashed passwords only
	role: varchar("role", { length: 50 }).default("user"), // e.g., 'admin', 'editor'
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	description: text("description").notNull(),
	content: text("content"),
	location: text("location").notNull(),
	eventDate: timestamp("event_date").notNull(),
	eventEndDate: timestamp("event_end_date"),
	imageUrl: text("image_url"),
	categoryId: integer("category_id").references(() => eventCategories.id),
	status: text("status", {
		enum: ["draft", "published", "cancelled", "completed"],
	}).notNull(),
	isFeatured: boolean("is_featured").default(false),
	createdBy: integer("created_by").references(() => users.id), // Make sure users table exists
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	seoMetadata: jsonb("seo_metadata"),
});

export const eventImages = pgTable("event_images", {
	id: serial("id").primaryKey(),
	eventId: integer("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	imageUrl: text("image_url").notNull(),
	altText: text("alt_text"),
	isFeatured: boolean("is_featured").default(false),
	displayOrder: integer("display_order").default(0),
	createdAt: timestamp("created_at").defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
	id: serial("id").primaryKey(),
	eventId: integer("event_id")
		.notNull()
		.references(() => events.id, { onDelete: "cascade" }),
	name: text("name").notNull(),
	email: text("email").notNull(),
	phone: text("phone"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow(),
});

// Newsletter Subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }),
	subscribedAt: timestamp("subscribed_at").defaultNow(),
	status: varchar("status", { length: 50 }).default("active"),
	source: varchar("source", { length: 100 }),
});

// Contact Submissions
export const contactSubmissions = pgTable("contact_submissions", {
	id: serial("id").primaryKey(),
	firstName: varchar("first_name", { length: 255 }).notNull(),
	lastName: varchar("last_name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
	subject: varchar("subject", { length: 255 }).notNull(),
	message: text("message").notNull(),
	phone: varchar("phone", { length: 50 }),
	status: varchar("status", { length: 50 }).default("unread"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

// Infer types for TypeScript
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventImage = typeof eventImages.$inferSelect;
export type NewEventImage = typeof eventImages.$inferInsert;
export type EventCategory = typeof eventCategories.$inferSelect;
export type NewEventCategory = typeof eventCategories.$inferInsert;
export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
