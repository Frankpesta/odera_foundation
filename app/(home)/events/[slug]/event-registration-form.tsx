"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { registerForEvent } from "@/actions/events";

export default function EventRegistrationForm({
	eventId,
}: {
	eventId: number;
}) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		const formData = new FormData(e.currentTarget);
		const data = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			notes: formData.get("notes") as string,
		};

		try {
			const result = await registerForEvent(eventId, data);

			if (result.success) {
				setIsSuccess(true);
				toast("You have successfully registered for the event!");
				e.currentTarget.reset();
			} else {
				toast(`${result.error}`);
			}
		} catch (error) {
			console.error("Error registering for event:", error);
			toast(
				"An error occurred while registering for the event. Please try again."
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isSuccess) {
		return (
			<div className="bg-emerald-50 dark:bg-emerald-900/30 p-6 rounded-lg text-center">
				<h3 className="text-lg font-semibold mb-2">Thank You!</h3>
				<p className="mb-4">
					Your registration has been received. We'll send you an email with all
					the details.
				</p>
				<Button
					onClick={() => setIsSuccess(false)}
					variant="outline"
					className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
					Register Another Person
				</Button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="bg-muted p-6 rounded-lg space-y-4">
			<div className="space-y-2">
				<Label htmlFor="name">Full Name</Label>
				<Input id="name" name="name" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input id="email" name="email" type="email" required />
			</div>

			<div className="space-y-2">
				<Label htmlFor="phone">Phone (Optional)</Label>
				<Input id="phone" name="phone" />
			</div>

			<div className="space-y-2">
				<Label htmlFor="notes">Special Requirements (Optional)</Label>
				<Textarea id="notes" name="notes" className="h-20" />
			</div>

			<Button
				type="submit"
				className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
				disabled={isSubmitting}>
				{isSubmitting ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Registering...
					</>
				) : (
					"Register Now"
				)}
			</Button>
		</form>
	);
}
