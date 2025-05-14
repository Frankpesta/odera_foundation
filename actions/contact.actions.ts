"use server";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { newsletterSubscribers, contactSubmissions } from "@/db/schema";

// Types for input validation
type NewsletterSubscriberInput = {
	email: string;
	name?: string;
	source?: string;
};

type ContactSubmissionInput = {
	firstName: string;
	lastName: string;
	email: string;
	subject: string;
	message: string;
	phone?: string;
};

// Newsletter Subscribers Actions
export async function subscribeToNewsletter(input: NewsletterSubscriberInput) {
	return await db
		.insert(newsletterSubscribers)
		.values({
			email: input.email,
			name: input.name,
			source: input.source,
			status: "active",
		})
		.returning();
}

export async function unsubscribeFromNewsletter(email: string) {
	return await db
		.update(newsletterSubscribers)
		.set({ status: "unsubscribed", subscribedAt: new Date() })
		.where(eq(newsletterSubscribers.email, email))
		.returning();
}

export async function getSubscriberByEmail(email: string) {
	return await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, email))
		.limit(1);
}

export async function deleteSubscriber(email: string) {
	return await db
		.delete(newsletterSubscribers)
		.where(eq(newsletterSubscribers.email, email))
		.returning();
}

export async function getActiveSubscribers() {
	return await db
		.select()
		.from(newsletterSubscribers)
		.where(eq(newsletterSubscribers.status, "active"));
}

export async function updateSubscriber(
	email: string,
	updates: Partial<NewsletterSubscriberInput>
) {
	return await db
		.update(newsletterSubscribers)
		.set({
			name: updates.name,
			source: updates.source,
		})
		.where(eq(newsletterSubscribers.email, email))
		.returning();
}

// Contact Submissions Actions
export async function createContactSubmission(input: ContactSubmissionInput) {
	return await db
		.insert(contactSubmissions)
		.values({
			firstName: input.firstName,
			lastName: input.lastName,
			email: input.email,
			subject: input.subject,
			message: input.message,
			phone: input.phone,
			status: "unread",
		})
		.returning();
}

export async function getContactSubmissionById(id: number) {
	return await db
		.select()
		.from(contactSubmissions)
		.where(eq(contactSubmissions.id, id))
		.limit(1);
}

export async function getContactSubmissions(status?: string) {
	const query = db.select().from(contactSubmissions);
	if (status) {
		query.where(eq(contactSubmissions.status, status));
	}
	return await query.orderBy(contactSubmissions.createdAt);
}

export async function updateContactSubmissionStatus(
	id: number,
	status: string
) {
	return await db
		.update(contactSubmissions)
		.set({
			status,
			updatedAt: new Date(),
		})
		.where(eq(contactSubmissions.id, id))
		.returning();
}

export async function deleteContactSubmission(id: number) {
	return await db
		.delete(contactSubmissions)
		.where(eq(contactSubmissions.id, id))
		.returning();
}
