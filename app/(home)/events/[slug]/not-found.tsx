import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EventNotFound() {
	return (
		<div className="container px-4 py-24 text-center">
			<h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
			<p className="text-xl text-muted-foreground mb-8">
				The event you're looking for doesn't exist or has been removed.
			</p>
			<Button
				asChild
				className="bg-emerald-600 hover:bg-emerald-700 text-white">
				<Link href="/events">View All Events</Link>
			</Button>
		</div>
	);
}
