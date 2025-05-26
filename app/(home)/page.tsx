"use client";

import { useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import anime from "animejs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	ArrowRight,
	Heart,
	BookOpen,
	Stethoscope,
	Users,
	Leaf,
} from "lucide-react";
import ImpactCounter from "@/components/impact-counter";
import NewsletterSignup from "@/components/newsletter-signup";
import { FeaturedEvents } from "@/components/featured-events";
import UltimateHero from "@/components/ultimate-hero";

export default function Home() {
	const missionRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const areasRef = useRef<HTMLDivElement>(null);
	const eventsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Mission section animation on scroll
		const observerMission = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						anime({
							targets: missionRef.current?.querySelectorAll(".animate-item"),
							translateY: [50, 0],
							opacity: [0, 1],
							delay: anime.stagger(150),
							easing: "easeOutQuad",
						});
						observerMission.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (missionRef.current) {
			observerMission.observe(missionRef.current);
		}

		// Stats section animation on scroll
		const observerStats = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						anime({
							targets: statsRef.current?.querySelectorAll(".animate-item"),
							scale: [0.8, 1],
							opacity: [0, 1],
							delay: anime.stagger(150),
							easing: "easeOutQuad",
						});
						observerStats.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (statsRef.current) {
			observerStats.observe(statsRef.current);
		}

		// Areas section animation on scroll
		const observerAreas = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						anime({
							targets: areasRef.current?.querySelectorAll(".animate-item"),
							translateX: [50, 0],
							opacity: [0, 1],
							delay: anime.stagger(150),
							easing: "easeOutQuad",
						});
						observerAreas.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (areasRef.current) {
			observerAreas.observe(areasRef.current);
		}

		// Events section animation on scroll
		const observerEvents = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						anime({
							targets: eventsRef.current?.querySelectorAll(".animate-item"),
							translateY: [30, 0],
							opacity: [0, 1],
							delay: anime.stagger(150),
							easing: "easeOutQuad",
						});
						observerEvents.disconnect();
					}
				});
			},
			{ threshold: 0.1 }
		);

		if (eventsRef.current) {
			observerEvents.observe(eventsRef.current);
		}

		return () => {
			observerMission.disconnect();
			observerStats.disconnect();
			observerAreas.disconnect();
			observerEvents.disconnect();
		};
	}, []);

	return (
		<div className="overflow-hidden">
			{/* Replace the old hero with our new UltimateHero */}
			<UltimateHero />

			{/* Mission Section */}
			<section ref={missionRef} className="py-20 bg-background">
				<div className="container px-4">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="animate-item text-3xl font-bold tracking-tight mb-6">
								Our Mission
							</h2>
							<p className="animate-item text-lg mb-6">
								At Odera Helping Hands Foundation, we are dedicated to
								alleviating poverty, promoting education, advancing healthcare,
								fostering community development, and protecting the environment
								through sustainable initiatives and partnerships.
							</p>
							<p className="animate-item text-lg mb-8">
								We believe in creating lasting change by empowering communities
								and addressing the root causes of social challenges.
							</p>
							<Button
								asChild
								className="animate-item bg-emerald-600 hover:bg-emerald-700 text-white">
								<Link href="/about">Learn More About Us</Link>
							</Button>
						</div>
						<div className="animate-item relative h-[400px] rounded-lg overflow-hidden shadow-xl">
							<Image
								src="/class2.jpg"
								alt="Children in a classroom"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Rest of the page content remains the same */}
			{/* Impact Stats Section */}
			<section ref={statsRef} className="py-20 bg-muted">
				<div className="container px-4">
					<h2 className="text-3xl font-bold tracking-tight text-center mb-16">
						Our Impact
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div className="animate-item bg-background rounded-lg p-6 text-center shadow-md">
							<ImpactCounter end={5000} duration={2000} />
							<p className="text-lg mt-2">People Helped</p>
						</div>
						<div className="animate-item bg-background rounded-lg p-6 text-center shadow-md">
							<ImpactCounter end={120} duration={2000} />
							<p className="text-lg mt-2">Communities Served</p>
						</div>
						<div className="animate-item bg-background rounded-lg p-6 text-center shadow-md">
							<ImpactCounter end={250} duration={2000} />
							<p className="text-lg mt-2">Educational Programs</p>
						</div>
						<div className="animate-item bg-background rounded-lg p-6 text-center shadow-md">
							<ImpactCounter end={15} duration={2000} />
							<p className="text-lg mt-2">Years of Service</p>
						</div>
					</div>
				</div>
			</section>

			{/* Focus Areas Section */}
			<section ref={areasRef} className="py-20 bg-background">
				<div className="container px-4">
					<h2 className="text-3xl font-bold tracking-tight text-center mb-16">
						Our Focus Areas
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						<Card className="animate-item overflow-hidden">
							<Image
								src={"/poverty2.jpg"}
								alt="poverty"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">Alleviating Poverty</h3>
								<p className="mb-4">
									Providing basic necessities like food, shelter, and healthcare
									to individuals and communities in need.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/our-work">
										Learn More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="animate-item overflow-hidden">
							<Image
								src={"/graduates.jpg"}
								alt="poverty"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">Promoting Education</h3>
								<p className="mb-4">
									Supporting educational initiatives through scholarships,
									educational materials, and literacy programs.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/our-work">
										Learn More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="animate-item overflow-hidden">
							<Image
								src={"/doctor.jpg"}
								alt="poverty"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">Advancing Healthcare</h3>
								<p className="mb-4">
									Improving healthcare access and quality, particularly for
									those with limited resources.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/our-work">
										Learn More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="animate-item overflow-hidden">
							<Image
								src={"/comdev.jpg"}
								alt="poverty"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">
									Community Development
								</h3>
								<p className="mb-4">
									Improving the overall well-being of communities through job
									training, infrastructure, and cultural enrichment.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/our-work">
										Learn More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="animate-item overflow-hidden">
							<Image
								src={"/env.jpg"}
								alt="poverty"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">
									Environmental Protection
								</h3>
								<p className="mb-4">
									Prioritizing environmental conservation and sustainable
									practices through research and conservation projects.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/our-work">
										Learn More <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						<Card className="animate-item overflow-hidden">
							<Image
								src="/upcoming.jpg"
								alt="Upcoming Events"
								width={1000}
								height={1000}
								className="object-cover rounded-lg w-full h-full -mt-6"
							/>

							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-2">Upcoming Events</h3>
								<p className="mb-4">
									Join us for our upcoming events and initiatives to make a
									difference in your community.
								</p>
								<Button asChild variant="link" className="p-0 text-emerald-600">
									<Link href="/events">
										View Events <ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Featured Events Section */}
			<section ref={eventsRef}>
				<Suspense
					fallback={
						<div className="py-20 bg-emerald-50 dark:bg-emerald-950/30">
							<div className="container px-4">
								<h2 className="text-3xl font-bold tracking-tight mb-12">
									Featured Events
								</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="h-[300px] bg-muted animate-pulse rounded-lg"></div>
									))}
								</div>
							</div>
						</div>
					}>
					<FeaturedEvents />
				</Suspense>
			</section>

			{/* Newsletter Section */}
			<section className="py-20 bg-background">
				<div className="container px-4">
					<NewsletterSignup />
				</div>
			</section>
		</div>
	);
}
