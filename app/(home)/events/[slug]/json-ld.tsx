import type { Event } from "@/actions/events";

export function JsonLd({ event }: { event: Event }) {
	// Get featured image
	const featuredImage =
		event.images && event.images.length > 0
			? event.images.find((img) => img.is_featured) || event.images[0]
			: null;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.title,
		description: event.description,
		startDate: event.event_date,
		endDate: event.event_end_date || event.event_date,
		location: {
			"@type": "Place",
			name: event.location,
			address: {
				"@type": "PostalAddress",
				addressLocality: event.location,
			},
		},
		image:
			featuredImage?.image_url ||
			event.image_url ||
			"https://oderahelpinghandsfoundation.org/og-image.jpg",
		organizer: {
			"@type": "Organization",
			name: "Odera Helping Hands Foundation",
			url: "https://oderahelpinghandsfoundation.org",
		},
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		offers: {
			"@type": "Offer",
			availability: "https://schema.org/InStock",
			price: "0",
			priceCurrency: "USD",
			validFrom: event.created_at,
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
