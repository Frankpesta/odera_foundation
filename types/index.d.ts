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
