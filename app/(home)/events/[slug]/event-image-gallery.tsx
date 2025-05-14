"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EventImageType } from "@/actions/events";

interface EventImageGalleryProps {
	images: EventImageType[];
}

export default function EventImageGallery({ images }: EventImageGalleryProps) {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const openLightbox = (index: number) => {
		setSelectedIndex(index);
		document.body.style.overflow = "hidden";
	};

	const closeLightbox = () => {
		setSelectedIndex(null);
		document.body.style.overflow = "auto";
	};

	const goToPrevious = () => {
		if (selectedIndex === null) return;
		setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
	};

	const goToNext = () => {
		if (selectedIndex === null) return;
		setSelectedIndex((selectedIndex + 1) % images.length);
	};

	// Handle keyboard navigation
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (selectedIndex === null) return;

		if (e.key === "ArrowLeft") {
			goToPrevious();
		} else if (e.key === "ArrowRight") {
			goToNext();
		} else if (e.key === "Escape") {
			closeLightbox();
		}
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Event Gallery</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				{images.map((image, index) => (
					<div
						key={image.id}
						className="relative aspect-square rounded-md overflow-hidden cursor-pointer"
						onClick={() => openLightbox(index)}>
						<Image
							src={image.imageUrl || "/placeholder.svg"}
							alt={image.altText || `Event image ${index + 1}`}
							fill
							className="object-cover hover:scale-105 transition-transform duration-300"
						/>
					</div>
				))}
			</div>

			{selectedIndex !== null && (
				<div
					className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
					onClick={closeLightbox}
					onKeyDown={handleKeyDown}
					tabIndex={0}>
					<Button
						variant="ghost"
						size="icon"
						className="absolute top-4 right-4 text-white hover:bg-white/10"
						onClick={closeLightbox}>
						<X className="h-6 w-6" />
						<span className="sr-only">Close</span>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="absolute left-4 text-white hover:bg-white/10"
						onClick={(e) => {
							e.stopPropagation();
							goToPrevious();
						}}>
						<ChevronLeft className="h-8 w-8" />
						<span className="sr-only">Previous</span>
					</Button>

					<div
						className="relative h-[80vh] w-[80vw] md:w-[60vw]"
						onClick={(e) => e.stopPropagation()}>
						<Image
							src={images[selectedIndex].imageUrl || "/placeholder.svg"}
							alt={
								images[selectedIndex].altText ||
								`Event image ${selectedIndex + 1}`
							}
							fill
							className="object-contain"
						/>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="absolute right-4 text-white hover:bg-white/10"
						onClick={(e) => {
							e.stopPropagation();
							goToNext();
						}}>
						<ChevronRight className="h-8 w-8" />
						<span className="sr-only">Next</span>
					</Button>
				</div>
			)}
		</div>
	);
}
