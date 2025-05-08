"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function NewsletterSignup() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSuccess(true);
			setEmail("");

			// Reset success message after 3 seconds
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);
		}, 1500);
	};

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader className="text-center">
				<CardTitle className="text-2xl font-bold">Stay Updated</CardTitle>
				<CardDescription>
					Subscribe to our newsletter to receive updates on our work, upcoming
					events, and ways to get involved.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={handleSubmit}
					className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
						<Input
							type="email"
							placeholder="Enter your email"
							className="pl-10"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<Button
						type="submit"
						className="bg-emerald-600 hover:bg-emerald-700 text-white"
						disabled={isSubmitting}>
						{isSubmitting ? "Subscribing..." : "Subscribe"}
					</Button>
				</form>
				{isSuccess && (
					<p className="mt-2 text-center text-sm text-emerald-600">
						Thank you for subscribing to our newsletter!
					</p>
				)}
			</CardContent>
		</Card>
	);
}
