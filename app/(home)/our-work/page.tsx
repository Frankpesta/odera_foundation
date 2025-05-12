import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Heart,
	BookOpen,
	Stethoscope,
	Users,
	Leaf,
	ArrowRight,
} from "lucide-react";

export default function OurWorkPage() {
	const focusAreas = [
		{
			id: "poverty",
			title: "Alleviating Poverty",
			description:
				"We provide basic necessities like food, shelter, and healthcare to individuals and communities in need through various initiatives.",
			icon: Heart,
			image: "/poverty.jpg",
			programs: [
				"Emergency Relief Distribution",
				"Sustainable Livelihood Programs",
				"Microfinance Initiatives",
				"Housing Support Projects",
			],
		},
		{
			id: "education",
			title: "Promoting Education",
			description:
				"We support educational initiatives through scholarships, educational materials, and literacy programs to empower future generations.",
			icon: BookOpen,
			image: "/education.jpg",
			programs: [
				"Scholarship Programs",
				"School Infrastructure Development",
				"Teacher Training Initiatives",
				"Digital Literacy Programs",
			],
		},
		{
			id: "healthcare",
			title: "Advancing Healthcare",
			description:
				"We improve healthcare access and quality, particularly for those with limited resources through medical camps and health education.",
			icon: Stethoscope,
			image: "/health.jpg",
			programs: [
				"Mobile Health Clinics",
				"Maternal and Child Health Programs",
				"Disease Prevention Campaigns",
				"Healthcare Worker Training",
			],
		},
		{
			id: "community",
			title: "Community Development",
			description:
				"We improve the overall well-being of communities through job training, infrastructure projects, and cultural enrichment programs.",
			icon: Users,
			image: "/community.jpg",
			programs: [
				"Vocational Training Centers",
				"Community Infrastructure Projects",
				"Youth Empowerment Programs",
				"Cultural Preservation Initiatives",
			],
		},
		{
			id: "environment",
			title: "Environmental Protection",
			description:
				"We prioritize environmental conservation and sustainable practices through research, conservation projects, and awareness campaigns.",
			icon: Leaf,
			image: "/environment.jpg",
			programs: [
				"Reforestation Projects",
				"Clean Water Initiatives",
				"Renewable Energy Programs",
				"Environmental Education Campaigns",
			],
		},
	];

	return (
		<div className="container px-4 py-12">
			<div className="max-w-3xl mx-auto mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Our Work</h1>
				<p className="text-xl text-muted-foreground">
					Discover the various initiatives and programs we run to create lasting
					positive change in communities.
				</p>
			</div>

			<div className="space-y-24 mb-16">
				{focusAreas.map((area, index) => (
					<div
						key={area.id}
						className={`grid md:grid-cols-2 gap-12 items-center ${
							index % 2 === 1 ? "md:grid-flow-dense" : ""
						}`}>
						<div className={index % 2 === 1 ? "md:col-start-2" : ""}>
							<div className="flex items-center gap-3 mb-4">
								<div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900">
									<area.icon className="h-5 w-5 text-emerald-600" />
								</div>
								<h2 className="text-3xl font-bold tracking-tight">
									{area.title}
								</h2>
							</div>
							<p className="text-lg mb-6">{area.description}</p>
							<div className="mb-6">
								<h3 className="text-xl font-semibold mb-3">Our Programs:</h3>
								<ul className="space-y-2">
									{area.programs.map((program, idx) => (
										<li key={idx} className="flex items-start">
											<div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
											<span>{program}</span>
										</li>
									))}
								</ul>
							</div>
							{/* <Button
								asChild
								className="bg-emerald-600 hover:bg-emerald-700 text-white">
								<Link href={`/our-work/${area.id}`}>
									Learn More <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button> */}
						</div>
						<div
							className={`relative h-[400px] rounded-lg overflow-hidden shadow-xl ${
								index % 2 === 1 ? "md:col-start-1" : ""
							}`}>
							<Image
								src={area.image || "/placeholder.svg"}
								alt={area.title}
								fill
								className="object-cover"
							/>
						</div>
					</div>
				))}
			</div>

			<div className="max-w-3xl mx-auto text-center">
				<h2 className="text-2xl font-bold mb-4">Want to support our work?</h2>
				<p className="mb-6">
					Your contribution can make a significant difference in the lives of
					those we serve. Join us in our mission to create a more equitable and
					compassionate world.
				</p>
				<div className="flex flex-wrap justify-center gap-4">
					<Button
						asChild
						className="bg-emerald-600 hover:bg-emerald-700 text-white">
						<Link href="/donate">Donate Now</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
