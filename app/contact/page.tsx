"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			setIsSuccess(true);

			// Reset form
			const form = e.target as HTMLFormElement;
			form.reset();

			// Reset success message after 5 seconds
			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		}, 1500);
	};

	return (
		<div className="container px-4 py-12">
			<div className="max-w-3xl mx-auto mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
				<p className="text-xl text-muted-foreground">
					Have questions or want to get involved? We'd love to hear from you.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
				<Card>
					<CardHeader>
						<CardTitle>Send Us a Message</CardTitle>
						<CardDescription>
							Fill out the form below and we'll get back to you as soon as
							possible.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="first-name">First Name</Label>
									<Input id="first-name" required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="last-name">Last Name</Label>
									<Input id="last-name" required />
								</div>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input id="email" type="email" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="subject">Subject</Label>
								<Input id="subject" required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="message">Message</Label>
								<Textarea id="message" className="min-h-[120px]" required />
							</div>
							<Button
								type="submit"
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
								disabled={isSubmitting}>
								{isSubmitting ? "Sending..." : "Send Message"}
							</Button>
							{isSuccess && (
								<div className="mt-4 p-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 rounded-md text-center">
									Thank you for your message! We'll get back to you soon.
								</div>
							)}
						</form>
					</CardContent>
				</Card>

				<div className="space-y-8">
					<div>
						<h2 className="text-2xl font-bold mb-6">Contact Information</h2>
						<div className="space-y-4">
							<div className="flex items-start">
								<MapPin className="h-5 w-5 mr-3 mt-0.5 text-emerald-600" />
								<div>
									<h3 className="font-semibold">Address</h3>
									<p className="text-muted-foreground">
										123 Charity Lane, Compassion City, 12345
									</p>
								</div>
							</div>
							<div className="flex items-start">
								<Phone className="h-5 w-5 mr-3 mt-0.5 text-emerald-600" />
								<div>
									<h3 className="font-semibold">Phone</h3>
									<p className="text-muted-foreground">+1 (234) 567-8901</p>
								</div>
							</div>
							<div className="flex items-start">
								<Mail className="h-5 w-5 mr-3 mt-0.5 text-emerald-600" />
								<div>
									<h3 className="font-semibold">Email</h3>
									<p className="text-muted-foreground">
										info@oderahelpinghand.org
									</p>
								</div>
							</div>
							<div className="flex items-start">
								<Clock className="h-5 w-5 mr-3 mt-0.5 text-emerald-600" />
								<div>
									<h3 className="font-semibold">Office Hours</h3>
									<p className="text-muted-foreground">
										Monday - Friday: 9:00 AM - 5:00 PM
										<br />
										Saturday: 10:00 AM - 2:00 PM
										<br />
										Sunday: Closed
									</p>
								</div>
							</div>
						</div>
					</div>

					<div>
						<h2 className="text-2xl font-bold mb-6">Follow Us</h2>
						<p className="mb-4">
							Stay connected with us on social media for updates on our work and
							upcoming events.
						</p>
						<div className="flex space-x-4">
							<Button variant="outline" size="icon" className="rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-facebook">
									<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
								</svg>
								<span className="sr-only">Facebook</span>
							</Button>
							<Button variant="outline" size="icon" className="rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-twitter">
									<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
								</svg>
								<span className="sr-only">Twitter</span>
							</Button>
							<Button variant="outline" size="icon" className="rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-instagram">
									<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
									<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
									<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
								</svg>
								<span className="sr-only">Instagram</span>
							</Button>
							<Button variant="outline" size="icon" className="rounded-full">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="lucide lucide-youtube">
									<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
									<path d="m10 15 5-3-5-3z" />
								</svg>
								<span className="sr-only">YouTube</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-16 max-w-5xl mx-auto h-[400px] rounded-lg overflow-hidden shadow-lg">
				{/* This would be replaced with an actual Google Maps embed */}
				<div className="w-full h-full bg-muted flex items-center justify-center">
					<p className="text-muted-foreground">
						Google Maps Embed Would Go Here
					</p>
				</div>
			</div>
		</div>
	);
}
