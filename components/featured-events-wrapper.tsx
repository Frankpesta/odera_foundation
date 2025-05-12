// app/components/featured-events-wrapper.tsx
import { getEvents } from "@/actions/events";
import { FeaturedEvents } from "./featured-events";

export async function FeaturedEventsWrapper() {
	const events = await getEvents({
		status: "published",
		featured: true,
		limit: 3,
	});

	console.log(events);

	// Early return if no events to avoid rendering the client component unnecessarily
	if (events.length === 0) {
		return null;
	}

	return <FeaturedEvents events={events} />;
}
