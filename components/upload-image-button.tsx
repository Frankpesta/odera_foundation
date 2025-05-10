"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing"; // Import typed UploadButton (adjust path as needed)
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UploadImageButtonProps {
	onUploadComplete: (urls: string[]) => void;
	existingImages?: string[];
	onRemoveImage?: (url: string) => void;
}

export function UploadImageButton({
	onUploadComplete,
	existingImages = [],
	onRemoveImage,
}: UploadImageButtonProps) {
	const [images, setImages] = useState<string[]>(existingImages);
	const [isUploading, setIsUploading] = useState(false);

	const handleUploadComplete = (res: { url: string }[]) => {
		const urls = res.map((file) => file.url);
		setImages((prev) => [...prev, ...urls]);
		onUploadComplete(urls);
		setIsUploading(false);
		toast(`${urls.length} image(s) uploaded successfully!`);
	};

	const handleRemoveImage = (url: string) => {
		setImages((prev) => prev.filter((image) => image !== url));
		if (onRemoveImage) {
			onRemoveImage(url);
		}
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{images.map((url, index) => (
					<div
						key={index}
						className="relative group rounded-md overflow-hidden border aspect-square">
						<Image
							src={url || "/placeholder.svg"}
							alt={`Event image ${index + 1}`}
							fill
							className="object-cover"
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
							onClick={() => handleRemoveImage(url)}>
							<X className="h-4 w-4" />
							<span className="sr-only">Remove image</span>
						</Button>
					</div>
				))}
			</div>

			<div className="flex items-center gap-4">
				<UploadButton
					endpoint="imageUploader" // Changed from "eventImage" to "imageUploader"
					onClientUploadComplete={handleUploadComplete}
					onUploadError={(error: Error) => {
						toast(`Error uploading image: ${error.message}`);
						setIsUploading(false);
					}}
					onUploadBegin={() => setIsUploading(true)}
					className="ut-button:bg-emerald-600 ut-button:hover:bg-emerald-700 ut-button:ut-uploading:bg-emerald-700/50"
				/>
				{isUploading && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Uploading...</span>
					</div>
				)}
			</div>
		</div>
	);
}
