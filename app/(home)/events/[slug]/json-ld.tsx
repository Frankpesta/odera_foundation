import type { EventType } from "@/actions/events";

export function JsonLd({ event }: { event: EventType }) {
	// Get featured image
	const featuredImage =
		Array.isArray(event.imageUrl) && event.imageUrl.length > 0
			? event.imageUrl.find((img) => img.is_featured) || event.imageUrl[0]
			: null;

	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Event",
		name: event.title,
		description: event.description,
		startDate: event.eventDate,
		endDate: event.eventEndDate || event.eventEndDate,
		location: {
			"@type": "Place",
			name: event.location,
			address: {
				"@type": "PostalAddress",
				addressLocality: event.location,
			},
		},
		image:
			featuredImage?.imageUrl ||
			event.imageUrl ||
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
			validFrom: event.createdAt,
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
		/>
	);
}
