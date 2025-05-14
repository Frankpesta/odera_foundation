import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AboutPage() {
	return (
		<div className="container px-4 py-12">
			<div className="max-w-3xl mx-auto mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">About Us</h1>
				<p className="text-xl text-muted-foreground">
					Learn about our mission, vision, and the team behind ODERA HELPING
					HANDS FOUNDATION.
				</p>
			</div>

			<Tabs defaultValue="mission" className="max-w-4xl mx-auto mb-16">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="mission">Our Mission</TabsTrigger>
					<TabsTrigger value="vision">Our Vision</TabsTrigger>
					<TabsTrigger value="history">Our History</TabsTrigger>
				</TabsList>
				<TabsContent
					value="mission"
					className="mt-6 p-6 bg-muted/30 rounded-lg">
					<h2 className="text-2xl font-bold mb-4">Our Mission</h2>
					<p className="mb-4">
						At Odera Helping Hands Foundation, our mission is to alleviate
						poverty, promote education, advance healthcare, foster community
						development, and protect the environment through sustainable
						initiatives and partnerships.
					</p>
					<p>
						We are dedicated to creating lasting change by empowering
						communities and addressing the root causes of social challenges.
						Through our programs and initiatives, we strive to improve the
						quality of life for vulnerable populations and create opportunities
						for sustainable development.
					</p>
				</TabsContent>
				<TabsContent value="vision" className="mt-6 p-6 bg-muted/30 rounded-lg">
					<h2 className="text-2xl font-bold mb-4">Our Vision</h2>
					<p className="mb-4">
						We envision a world where every individual has access to basic
						necessities, quality education, healthcare, and lives in a clean and
						sustainable environment. A world where communities are empowered to
						drive their own development and where social inequalities are
						minimized.
					</p>
					<p>
						Our vision is to be a leading organization in creating sustainable
						solutions to social challenges, fostering partnerships that amplify
						our impact, and inspiring others to join in our mission to create a
						more equitable and compassionate world.
					</p>
				</TabsContent>
				<TabsContent
					value="history"
					className="mt-6 p-6 bg-muted/30 rounded-lg">
					<h2 className="text-2xl font-bold mb-4">Our History</h2>
					<p className="mb-4">
						Odera Helping Hands Foundation was established in 2008 by a group of
						passionate individuals who witnessed the challenges faced by
						vulnerable communities and were determined to make a difference.
						What began as a small initiative to provide basic necessities to a
						local community has grown into a comprehensive organization
						addressing multiple social challenges.
					</p>
					<p>
						Over the years, we have expanded our reach, developed new programs,
						and formed valuable partnerships that have enabled us to impact
						thousands of lives. Our journey has been marked by dedication,
						resilience, and a commitment to creating sustainable change.
					</p>
				</TabsContent>
			</Tabs>

			<div className="mb-16">
				<h2 className="text-3xl font-bold tracking-tight text-center mb-8">
					Our Team
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{[
						{
							name: "Dr. Odera Johnson",
							role: "Founder & Executive Director",
							bio: "Dr. Odera has over 20 years of experience in humanitarian work and community development.",
							image: "/headodera.jpg",
						},
						{
							name: "Sarah Mwangi",
							role: "Director of Programs",
							bio: "Sarah oversees all our programs and ensures they align with our mission and vision.",
							image: "/placeholder.svg?height=400&width=400",
						},
						{
							name: "Michael Okonkwo",
							role: "Director of Operations",
							bio: "Michael manages the day-to-day operations and ensures efficient resource allocation.",
							image: "/placeholder.svg?height=400&width=400",
						},
					].map((member, index) => (
						<Card key={index} className="overflow-hidden">
							<div className="relative h-64">
								<Image
									src={member.image || "/placeholder.svg"}
									alt={member.name}
									fill
									className="object-cover"
								/>
							</div>
							<CardContent className="p-6">
								<h3 className="text-xl font-bold mb-1">{member.name}</h3>
								<p className="text-emerald-600 mb-3">{member.role}</p>
								<p className="text-muted-foreground">{member.bio}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* <div className="mb-16">
				<h2 className="text-3xl font-bold tracking-tight text-center mb-8">
					Our Partners
				</h2>
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
					{[1, 2, 3, 4, 5, 6].map((partner) => (
						<div
							key={partner}
							className="bg-muted/30 p-6 rounded-lg flex items-center justify-center">
							<Image
								src={`/placeholder.svg?height=100&width=150`}
								alt={`Partner ${partner}`}
								width={150}
								height={100}
								className="opacity-70 hover:opacity-100 transition-opacity"
							/>
						</div>
					))}
				</div>
			</div> */}
		</div>
	);
}
