import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, ArrowLeft, Share2 } from "lucide-react";
import { getEventBySlug, getEvents } from "@/actions/events";
import { format } from "date-fns";
import EventRegistrationForm from "./event-registration-form";
import EventImageGallery from "./event-image-gallery";
import type { Metadata } from "next";
import { JsonLd } from "./json-ld";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
	const events = await getEvents({ status: "published" });

	return events.map((event) => ({
		slug: event.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const event = await getEventBySlug(params.slug);

	if (!event) {
		return {
			title: "Event Not Found",
			description:
				"The event you're looking for doesn't exist or has been removed.",
		};
	}

	return {
		title: `${event.title} | Odera Helping Hands Foundation`,
		description: event.description.substring(0, 160),
		openGraph: {
			title: event.title,
			description: event.description.substring(0, 160),
			type: "article",
			publishedTime: event.created_at.toString(),
			url: `https://oderahelpinghand.org/events/${event.slug}`,
			images: [
				{
					url:
						event.images && event.images.length > 0
							? event.images[0].image_url
							: event.image_url || "https://oderahelpinghand.org/og-image.jpg",
					width: 1200,
					height: 630,
					alt: event.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: event.title,
			description: event.description.substring(0, 160),
			images: [
				event.images && event.images.length > 0
					? event.images[0].image_url
					: event.image_url || "https://oderahelpinghand.org/og-image.jpg",
			],
		},
	};
}

export default async function EventPage({
	params,
}: {
	params: { slug: string };
}) {
	const event = await getEventBySlug(params.slug);

	if (!event) {
		notFound();
	}

	const eventDate = new Date(event.event_date);
	const isPastEvent = eventDate < new Date();

	// Get featured image
	const featuredImage =
		event.images && event.images.length > 0
			? event.images.find((img) => img.is_featured) || event.images[0]
			: null;

	return (
		<>
			<JsonLd event={event} />

			<div className="container px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<Link
						href="/events"
						className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-8">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Events
					</Link>

					<div className="relative h-[400px] rounded-lg overflow-hidden mb-8">
						<Image
							src={
								featuredImage?.image_url ||
								event.image_url ||
								"/placeholder.svg?height=800&width=1200"
							}
							alt={event.title}
							fill
							className="object-cover"
							priority
						/>
					</div>

					{event.images && event.images.length > 1 && (
						<div className="mb-8">
							<EventImageGallery images={event.images} />
						</div>
					)}

					<div className="flex flex-col md:flex-row gap-8">
						<div className="flex-1">
							<h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
								{event.title}
							</h1>

							<div className="flex flex-col gap-3 mb-6">
								<div className="flex items-center text-muted-foreground">
									<Calendar className="h-5 w-5 mr-3" />
									<span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
								</div>
								<div className="flex items-center text-muted-foreground">
									<Clock className="h-5 w-5 mr-3" />
									<span>9:00 AM - 3:00 PM</span>
								</div>
								<div className="flex items-center text-muted-foreground">
									<MapPin className="h-5 w-5 mr-3" />
									<span>{event.location}</span>
								</div>
							</div>

							<div className="prose dark:prose-invert max-w-none mb-8">
								<h2>About This Event</h2>
								<p>{event.description}</p>
								{event.content && (
									<div
										dangerouslySetInnerHTML={{
											__html: event.content.replace(/\n/g, "<br />"),
										}}
									/>
								)}
							</div>

							<div className="flex items-center justify-between mb-12">
								<Button variant="outline" className="gap-2">
									<Share2 className="h-4 w-4" />
									Share Event
								</Button>

								{!isPastEvent && (
									<Button
										asChild
										className="bg-emerald-600 hover:bg-emerald-700 text-white">
										<a href="#register">Register Now</a>
									</Button>
								)}
							</div>
						</div>

						<div className="w-full md:w-[300px]">
							{!isPastEvent ? (
								<div id="register">
									<h2 className="text-xl font-bold mb-4">
										Register for this Event
									</h2>
									<Suspense fallback={<div>Loading registration form...</div>}>
										<EventRegistrationForm eventId={event.id} />
									</Suspense>
								</div>
							) : (
								<div className="bg-muted p-6 rounded-lg">
									<h2 className="text-xl font-bold mb-2">Event Completed</h2>
									<p className="text-muted-foreground mb-4">
										This event has already taken place. Check out our upcoming
										events.
									</p>
									<Button
										asChild
										className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
										<Link href="/events?tab=upcoming">
											View Upcoming Events
										</Link>
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
