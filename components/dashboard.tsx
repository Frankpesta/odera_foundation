"use client";

import { useEffect, useRef } from "react";
import anime from "animejs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Calendar,
	Clock,
	Users,
	Activity,
	BarChartIcon,
	PieChartIcon,
} from "lucide-react";
import { Event } from "@/types";
import { BarChart, PieChart } from "@/components/charts";

type DashboardStats = {
	totalEvents: number;
	publishedEvents: number;
	upcomingEvents: number;
	featuredEvents: number;
};

export default function DashboardPage({ stats }: { stats: DashboardStats }) {
	const headerRef = useRef(null);
	const chartLeftRef = useRef(null);
	const chartRightRef = useRef(null);
	const recentRef = useRef(null);

	useEffect(() => {
		anime({
			targets: headerRef.current,
			opacity: [0, 1],
			translateY: [-20, 0],
			duration: 500,
			easing: "easeOutQuad",
		});

		anime({
			targets: chartLeftRef.current,
			opacity: [0, 1],
			translateX: [-20, 0],
			delay: 200,
			duration: 500,
			easing: "easeOutQuad",
		});

		anime({
			targets: chartRightRef.current,
			opacity: [0, 1],
			translateX: [20, 0],
			delay: 200,
			duration: 500,
			easing: "easeOutQuad",
		});

		anime({
			targets: recentRef.current,
			opacity: [0, 1],
			translateY: [20, 0],
			delay: 400,
			duration: 500,
			easing: "easeOutQuad",
		});
	}, []);

	return (
		<div className="container py-8 space-y-8">
			{/* Header */}
			<div ref={headerRef}>
				<h1 className="text-3xl font-bold tracking-tight">
					Dashboard Overview
				</h1>
				<p className="text-muted-foreground">
					Summary of your event statistics and metrics
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					icon={<Calendar className="h-6 w-6" />}
					title="Upcoming Events"
					value={stats?.upcomingEvents}
					description="Scheduled in next 30 days"
					trend="up"
					change={3}
				/>
				<StatCard
					icon={<Clock className="h-6 w-6" />}
					title="Total Events"
					value={stats?.totalEvents}
					description="All this year"
					trend="down"
					change={2}
				/>
				<StatCard
					icon={<Users className="h-6 w-6" />}
					title="Featured Events"
					value={stats?.featuredEvents}
					description="On the homePage"
					trend="up"
					change={14}
				/>
				<StatCard
					icon={<Activity className="h-6 w-6" />}
					title="Published Events"
					value={stats?.publishedEvents}
					description="Of Events published"
					trend="up"
					change={5}
				/>
			</div>

			{/* Charts Section */}
			<div className="grid gap-4 md:grid-cols-2">
				<div ref={chartLeftRef}>
					<Card>
						<CardHeader>
							<CardTitle>Events by Month</CardTitle>
						</CardHeader>
						<CardContent className="h-[300px]">
							<BarChart data={[]} />
						</CardContent>
					</Card>
				</div>
				<div ref={chartRightRef}>
					<Card>
						<CardHeader>
							<CardTitle>Event Types</CardTitle>
						</CardHeader>
						<CardContent className="h-[300px]">
							<PieChart data={[]} />
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Recent Events */}
			{/* <div ref={recentRef}>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Recent Events</CardTitle>
						<Button variant="outline">View All</Button>
					</CardHeader>
					<CardContent>
						<RecentEventsTable />
					</CardContent>
				</Card>
			</div> */}
		</div>
	);
}

// Stat Card Component with hover animation
function StatCard({
	icon,
	title,
	value,
	description,
	trend,
	change,
}: {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	description: string;
	trend: "up" | "down";
	change: number;
}) {
	const cardRef = useRef<HTMLDivElement>(null);

	const animateIn = () => {
		anime({
			targets: cardRef.current,
			translateY: -5,
			duration: 300,
			easing: "easeOutBack",
		});
	};

	const animateOut = () => {
		anime({
			targets: cardRef.current,
			translateY: 0,
			duration: 300,
			easing: "easeOutBack",
		});
	};

	return (
		<div ref={cardRef} onMouseEnter={animateIn} onMouseLeave={animateOut}>
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">
								{title}
							</p>
							<h2 className="text-2xl font-bold">{value}</h2>
							<p className="text-xs text-muted-foreground">{description}</p>
						</div>
						<div className="rounded-lg bg-primary/10 p-3 text-primary">
							{icon}
						</div>
					</div>
					<div
						className={`mt-4 text-sm ${
							trend === "up" ? "text-green-500" : "text-red-500"
						}`}>
						{trend === "up" ? "↑" : "↓"} {change}% from last month
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

// Recent Events Table Component
function RecentEventsTable() {
	const events: Event[] = [
		{
			id: 1,
			title: "Tech Conference 2023",
			slug: "tech-conference-2023",
			description: "A major tech conference for 2023.",
			location: "Convention Center",
			is_featured: true,
			event_date: new Date("2023-11-15"),
			event_end_date: new Date("2023-11-17"),
			image_url: "https://example.com/image.jpg",
			category_id: 1,
			status: "completed",
			created_by: 1,
			created_at: new Date("2023-01-01"),
			updated_at: new Date("2023-01-02"),
		},
	];

	return (
		<div className="rounded-md border">
			<div className="relative w-full overflow-auto">
				<table className="w-full caption-bottom text-sm">
					<thead className="[&_tr]:border-b">
						<tr className="border-b transition-colors hover:bg-muted/50">
							<th className="h-12 px-4 text-left font-medium text-muted-foreground">
								Event
							</th>
							<th className="h-12 px-4 text-left font-medium text-muted-foreground">
								Date
							</th>
							<th className="h-12 px-4 text-left font-medium text-muted-foreground">
								Attendees
							</th>
							<th className="h-12 px-4 text-left font-medium text-muted-foreground">
								Status
							</th>
						</tr>
					</thead>
					<tbody className="[&_tr:last-child]:border-0">
						{events.map((event) => (
							<tr
								key={event.id}
								className="border-b transition-colors hover:bg-muted/50">
								<td className="p-4 font-medium">{event.title}</td>
								<td className="p-4">{event.event_date.toLocaleDateString()}</td>
								<td className="p-4">123</td>
								<td className="p-4">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
											event.status === "completed"
												? "bg-green-100 text-green-800"
												: "bg-blue-100 text-blue-800"
										}`}>
										{event.status === "completed" ? "Completed" : "Upcoming"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
