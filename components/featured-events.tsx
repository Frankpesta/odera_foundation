// app/components/featured-events.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getEvents } from "@/actions/events";

interface Event {
	id: string;
	title: string;
	description: string;
	event_date: string;
	location: string;
	slug: string;
	image_url: string | null;
}

interface FeaturedEventsProps {
	events: Event[];
}

export function FeaturedEvents() {
	const [newEvents, setNewEvents] = useState<Event[]>([]);
	useEffect(() => {
		async function getFeaturedEvents() {
			const events = await getEvents({
				status: "published",
				featured: true,
				limit: 3,
			});
			if (events.length === 0) {
				return null;
			} else {
				setNewEvents(events);
			}
		}
		getFeaturedEvents();
	}, []);
	return (
		<section className="py-20 bg-emerald-50 dark:bg-emerald-950/30">
			<div className="container px-4">
				<div className="flex justify-between items-center mb-12">
					<h2 className="text-3xl font-bold tracking-tight">Featured Events</h2>
					<Button
						asChild
						variant="outline"
						className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
						<Link href="/events">View All Events</Link>
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{newEvents?.map((event) => (
						<Card key={event.id} className="animate-item overflow-hidden">
							<div className="relative h-48">
								<Image
									src={
										event?.image_url || "/placeholder.svg?height=400&width=600"
									}
									alt={event.title}
									fill
									className="object-cover -mt-6"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								/>
							</div>
							<CardContent className="p-6">
								<div className="text-sm text-muted-foreground mb-2">
									{format(new Date(event.event_date), "MMMM d, yyyy")}
								</div>
								<h3 className="text-xl font-bold mb-2">{event.title}</h3>
								<div className="flex items-center text-sm text-muted-foreground mb-4">
									<MapPin className="h-4 w-4 mr-2" />
									<span>{event.location}</span>
								</div>
								<p className="mb-4">{event.description.substring(0, 120)}...</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href={`/events/${event.slug}`}>
										Read More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
