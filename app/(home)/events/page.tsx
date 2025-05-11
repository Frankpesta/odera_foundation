import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getEvents } from "@/actions/events";
import { format } from "date-fns";
import EventsLoading from "./loading";

export const dynamic = "force-dynamic";

export default async function EventsPage({
	searchParams,
}: {
	searchParams: { tab?: string };
}) {
	const activeTab = searchParams.tab || "upcoming";

	return (
		<div className="container px-4 py-12">
			<div className="max-w-3xl mx-auto mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Events</h1>
				<p className="text-xl text-muted-foreground">
					Stay updated with our past and upcoming events and initiatives.
				</p>
			</div>

			<Tabs defaultValue={activeTab} className="max-w-5xl mx-auto mb-16">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="upcoming" asChild>
						<Link href="/events?tab=upcoming">Upcoming Events</Link>
					</TabsTrigger>
					<TabsTrigger value="past" asChild>
						<Link href="/events?tab=past">Past Events</Link>
					</TabsTrigger>
				</TabsList>

				<Suspense fallback={<EventsLoading />}>
					{activeTab === "upcoming" ? <UpcomingEvents /> : <PastEvents />}
				</Suspense>
			</Tabs>

			{activeTab === "upcoming" && (
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-2xl font-bold mb-4">
						Want to host an event with us?
					</h2>
					<p className="mb-6">
						We're always looking for partners to collaborate with on events that
						align with our mission. If you're interested in hosting an event
						with us, please get in touch.
					</p>
					<Button
						asChild
						className="bg-emerald-600 hover:bg-emerald-700 text-white">
						<Link href="/contact">Contact Us</Link>
					</Button>
				</div>
			)}
		</div>
	);
}

async function UpcomingEvents() {
	const events = await getEvents({
		status: "published",
		upcoming: true,
	});

	return (
		<TabsContent value="upcoming" className="mt-6">
			{events.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-lg text-muted-foreground mb-4">
						No upcoming events at the moment.
					</p>
					<p>Check back soon or subscribe to our newsletter to stay updated.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.map((event) => (
						<Card key={event.id} className="overflow-hidden">
							<div className="relative h-48">
								<Image
									src={
										event.image_url || "/placeholder.svg?height=400&width=600"
									}
									alt={event.title}
									fill
									className="object-cover"
								/>
							</div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">{event.title}</h3>
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Calendar className="h-4 w-4 mr-2" />
									<span>{format(new Date(event.event_date), "PPP")}</span>
								</div>
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Clock className="h-4 w-4 mr-2" />
									<span>9:00 AM - 3:00 PM</span>
								</div>
								<div className="flex items-center text-sm text-muted-foreground mb-4">
									<MapPin className="h-4 w-4 mr-2" />
									<span>{event.location}</span>
								</div>
								<p className="mb-4">{event.description}</p>
								<div className="flex justify-between">
									<Button
										asChild
										variant="outline"
										className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
										<Link href={`/events/${event.slug}`}>Learn More</Link>
									</Button>
									<Button
										asChild
										className="bg-emerald-600 hover:bg-emerald-700 text-white">
										<Link href={`/events/${event.slug}#register`}>
											Register
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</TabsContent>
	);
}

async function PastEvents() {
	const events = await getEvents({
		status: "published",
		upcoming: false,
	});

	return (
		<TabsContent value="past" className="mt-6">
			{events.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-lg text-muted-foreground mb-4">
						No past events to display.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{events.map((event) => (
						<Card key={event.id} className="overflow-hidden">
							<div className="relative h-48">
								<Image
									src={
										event.image_url || "/placeholder.svg?height=400&width=600"
									}
									alt={event.title}
									fill
									className="object-cover"
								/>
							</div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">{event.title}</h3>
								<div className="flex items-center text-sm text-muted-foreground mb-2">
									<Calendar className="h-4 w-4 mr-2" />
									<span>{format(new Date(event.event_date), "PPP")}</span>
								</div>
								<div className="flex items-center text-sm text-muted-foreground mb-4">
									<MapPin className="h-4 w-4 mr-2" />
									<span>{event.location}</span>
								</div>
								<p className="mb-4">{event.description}</p>
								<Button
									asChild
									variant="outline"
									className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50">
									<Link href={`/events/${event.slug}`}>View Details</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</TabsContent>
	);
}
