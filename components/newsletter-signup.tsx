"use client";

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
import { subscribeToNewsletter } from "@/actions/contact.actions";

export default function NewsletterSignup() {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			if (!isValidEmail(email)) {
				setError("Please enter a valid email address");
				return;
			}
			await subscribeToNewsletter({
				email,
				name: name || undefined, // Make name optional
				source: "website_signup", // You can track where signups come from
			});

			setIsSuccess(true);
			setEmail("");
			setName("");

			// Reset success message after 3 seconds
			setTimeout(() => {
				setIsSuccess(false);
			}, 3000);
		} catch (err) {
			setError("Failed to subscribe. Please try again later.");
			console.error("Subscription error:", err);
		} finally {
			setIsSubmitting(false);
		}
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
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="flex flex-col sm:flex-row gap-3">
						<div className="flex-1">
							<Input
								type="text"
								placeholder="Your name (optional)"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div className="relative flex-1">
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
							<Input
								type="email"
								placeholder="Enter your email*"
								className="pl-10"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					</div>
					<Button
						type="submit"
						className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
						disabled={isSubmitting}>
						{isSubmitting ? "Subscribing..." : "Subscribe"}
					</Button>
				</form>
				{isSuccess && (
					<p className="mt-2 text-center text-sm text-emerald-600">
						Thank you for subscribing to our newsletter!
					</p>
				)}
				{error && (
					<p className="mt-2 text-center text-sm text-red-600">{error}</p>
				)}
			</CardContent>
		</Card>
	);
}
