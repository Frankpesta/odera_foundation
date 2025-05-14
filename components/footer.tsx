"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Facebook,
	Twitter,
	Instagram,
	Youtube,
	Mail,
	Phone,
	MapPin,
} from "lucide-react";
import { subscribeToNewsletter } from "@/actions/contact.actions";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			await subscribeToNewsletter({
				email,
				source: "footer_signup", // Track where signups come from
			});

			setIsSuccess(true);
			setEmail("");

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
		<footer className="bg-emerald-950 text-white">
			<div className="container px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<div>
						<h3 className="text-xl font-bold mb-4">ODERA HELPING HAND</h3>
						<p className="mb-4 text-emerald-100">
							Transforming lives through compassion, education, and sustainable
							development.
						</p>
						<div className="flex space-x-4">
							<Link href="#" className="text-emerald-100 hover:text-white">
								<Facebook className="h-5 w-5" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link href="#" className="text-emerald-100 hover:text-white">
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</Link>
							<Link href="#" className="text-emerald-100 hover:text-white">
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link href="#" className="text-emerald-100 hover:text-white">
								<Youtube className="h-5 w-5" />
								<span className="sr-only">YouTube</span>
							</Link>
						</div>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/about"
									className="text-emerald-100 hover:text-white">
									About Us
								</Link>
							</li>
							<li>
								<Link
									href="/our-work"
									className="text-emerald-100 hover:text-white">
									Our Work
								</Link>
							</li>
							<li>
								<Link
									href="/events"
									className="text-emerald-100 hover:text-white">
									Events
								</Link>
							</li>
							<li>
								<Link
									href="/donate"
									className="text-emerald-100 hover:text-white">
									Donate
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="text-emerald-100 hover:text-white">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-4">Contact Us</h3>
						<ul className="space-y-3">
							<li className="flex items-start">
								<MapPin className="h-5 w-5 mr-2 mt-0.5 text-emerald-400" />
								<span className="text-emerald-100">
									Plot 1032A1 Independence Layout Enugu
								</span>
							</li>
							<li className="flex items-center">
								<Phone className="h-5 w-5 mr-2 text-emerald-400" />
								<span className="text-emerald-100">+234 803 569 6810</span>
							</li>
							<li className="flex items-center">
								<Mail className="h-5 w-5 mr-2 text-emerald-400" />
								<span className="text-emerald-100">
									info@oderahelpinghandsfoundation.org
								</span>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-xl font-bold mb-4">Newsletter</h3>
						<p className="mb-4 text-emerald-100">
							Subscribe to our newsletter to receive updates on our work and
							upcoming events.
						</p>
						<form onSubmit={handleSubmit} className="flex flex-col space-y-2">
							<Input
								type="email"
								placeholder="Your email address"
								className="bg-emerald-900 border-emerald-700 text-white placeholder:text-emerald-300"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<Button
								type="submit"
								className="bg-emerald-600 hover:bg-emerald-700 text-white"
								disabled={isSubmitting}>
								{isSubmitting ? "Subscribing..." : "Subscribe"}
							</Button>
						</form>
						{isSuccess && (
							<p className="mt-2 text-sm text-emerald-400">
								Thank you for subscribing!
							</p>
						)}
						{error && <p className="mt-2 text-sm text-red-400">{error}</p>}
					</div>
				</div>

				<div className="border-t border-emerald-800 mt-12 pt-6 text-center text-emerald-300">
					<p>
						© {new Date().getFullYear()} Odera Helping Hands Foundation. All
						rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
