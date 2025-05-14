"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, CreditCard, Landmark, Wallet } from "lucide-react";

export default function DonatePage() {
	const [donationAmount, setDonationAmount] = useState<string>("50");
	const [customAmount, setCustomAmount] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleDonationSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate payment processing
		setTimeout(() => {
			setIsSubmitting(false);
			alert("Thank you for your donation!");
			// Reset form or redirect
		}, 1500);
	};

	return (
		<div className="container px-4 py-12">
			<div className="max-w-3xl mx-auto mb-12 text-center">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Support Our Cause
				</h1>
				<p className="text-xl text-muted-foreground">
					Your donation helps us continue our work in alleviating poverty,
					promoting education, advancing healthcare, fostering community
					development, and protecting the environment.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
				<div>
					<h2 className="text-2xl font-bold mb-6">Why Donate?</h2>
					<div className="space-y-6">
						<div className="flex items-start">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 mr-4 mt-1">
								<Heart className="h-5 w-5 text-emerald-600" />
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">
									Make a Difference
								</h3>
								<p className="text-muted-foreground">
									Your donation directly impacts the lives of those in need,
									providing essential resources and support to vulnerable
									communities.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 mr-4 mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-emerald-600">
									<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
								</svg>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">Transparency</h3>
								<p className="text-muted-foreground">
									We are committed to transparency and accountability. Your
									donation is used efficiently and effectively to support our
									programs.
								</p>
							</div>
						</div>

						<div className="flex items-start">
							<div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 mr-4 mt-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="text-emerald-600">
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
									<path d="M16 3.13a4 4 0 0 1 0 7.75" />
								</svg>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-2">
									Join Our Community
								</h3>
								<p className="text-muted-foreground">
									By donating, you become part of a community of supporters who
									share our vision of a more equitable and compassionate world.
								</p>
							</div>
						</div>
					</div>

					<div className="mt-8">
						<h3 className="text-xl font-semibold mb-4">Our Impact</h3>
						<div className="relative h-[200px] rounded-lg overflow-hidden mb-4">
							<Image
								src="/placeholder.svg?height=400&width=600"
								alt="Our Impact"
								fill
								className="object-cover"
							/>
						</div>
						<p className="text-muted-foreground">
							In the past year, your donations have helped us:
						</p>
						<ul className="mt-2 space-y-2">
							<li className="flex items-start">
								<div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
								<span>Provide clean water to over 10,000 people</span>
							</li>
							<li className="flex items-start">
								<div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
								<span>Build 5 new schools in underserved communities</span>
							</li>
							<li className="flex items-start">
								<div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
								<span>
									Provide healthcare services to over 5,000 individuals
								</span>
							</li>
							<li className="flex items-start">
								<div className="mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600"></div>
								<span>Plant 20,000 trees to combat deforestation</span>
							</li>
						</ul>
					</div>
				</div>

				<div>
					<Card>
						<CardHeader>
							<CardTitle>Make a Donation</CardTitle>
							<CardDescription>
								Your support helps us continue our mission. All donations are
								tax-deductible.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleDonationSubmit}>
								<div className="space-y-6">
									<div>
										<Label className="mb-3 block">Select Amount</Label>
										<div className="grid grid-cols-3 gap-3 mb-4">
											{["25", "50", "100", "250", "500", "1000"].map(
												(amount) => (
													<Button
														key={amount}
														type="button"
														variant={
															donationAmount === amount ? "default" : "outline"
														}
														className={
															donationAmount === amount
																? "bg-emerald-600 hover:bg-emerald-700"
																: ""
														}
														onClick={() => {
															setDonationAmount(amount);
															setCustomAmount("");
														}}>
														${amount}
													</Button>
												)
											)}
										</div>
										<div className="relative">
											<Input
												type="text"
												placeholder="Custom Amount"
												value={customAmount}
												onChange={(e) => {
													setCustomAmount(e.target.value);
													if (e.target.value) {
														setDonationAmount("custom");
													} else {
														setDonationAmount("50");
													}
												}}
												className="pl-8"
											/>
											<span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
												$
											</span>
										</div>
									</div>

									<div>
										<Label className="mb-3 block">Donation Type</Label>
										<RadioGroup defaultValue="one-time">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="one-time" id="one-time" />
												<Label htmlFor="one-time">One-time Donation</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="monthly" id="monthly" />
												<Label htmlFor="monthly">Monthly Donation</Label>
											</div>
										</RadioGroup>
									</div>

									<div>
										<Label className="mb-3 block">Payment Method</Label>
										<Tabs defaultValue="card">
											<TabsList className="grid w-full grid-cols-3">
												<TabsTrigger value="card">
													<CreditCard className="h-4 w-4 mr-2" />
													Card
												</TabsTrigger>
												<TabsTrigger value="bank">
													<Landmark className="h-4 w-4 mr-2" />
													Bank
												</TabsTrigger>
												<TabsTrigger value="paypal">
													<Wallet className="h-4 w-4 mr-2" />
													PayPal
												</TabsTrigger>
											</TabsList>
											<TabsContent value="card" className="space-y-4 mt-4">
												<div className="space-y-2">
													<Label htmlFor="card-number">Card Number</Label>
													<Input
														id="card-number"
														placeholder="1234 5678 9012 3456"
													/>
												</div>
												<div className="grid grid-cols-2 gap-4">
													<div className="space-y-2">
														<Label htmlFor="expiry">Expiry Date</Label>
														<Input id="expiry" placeholder="MM/YY" />
													</div>
													<div className="space-y-2">
														<Label htmlFor="cvc">CVC</Label>
														<Input id="cvc" placeholder="123" />
													</div>
												</div>
											</TabsContent>
											<TabsContent value="bank" className="space-y-4 mt-4">
												<div className="space-y-2">
													<Label htmlFor="account-name">Account Name</Label>
													<Input id="account-name" />
												</div>
												<div className="space-y-2">
													<Label htmlFor="account-number">Account Number</Label>
													<Input id="account-number" />
												</div>
												<div className="space-y-2">
													<Label htmlFor="routing-number">Routing Number</Label>
													<Input id="routing-number" />
												</div>
											</TabsContent>
											<TabsContent value="paypal" className="mt-4">
												<p className="text-center text-muted-foreground mb-4">
													You will be redirected to PayPal to complete your
													donation.
												</p>
												<div className="flex justify-center">
													<Image
														src="/placeholder.svg?height=60&width=200"
														alt="PayPal"
														width={200}
														height={60}
													/>
												</div>
											</TabsContent>
										</Tabs>
									</div>
								</div>
							</form>
						</CardContent>
						<CardFooter>
							<Button
								className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
								onClick={handleDonationSubmit}
								disabled={isSubmitting}>
								{isSubmitting
									? "Processing..."
									: `Donate $${
											donationAmount === "custom"
												? customAmount
												: donationAmount
									  }`}
							</Button>
						</CardFooter>
					</Card>

					<div className="mt-6 p-4 bg-muted rounded-lg">
						<h3 className="text-sm font-semibold mb-2">Other Ways to Donate</h3>
						<p className="text-sm text-muted-foreground mb-2">
							If you prefer to donate by check or bank transfer, please contact
							us at:
						</p>
						<p className="text-sm">
							<strong>Email:</strong> donations@oderahelpinghand.org
							<br />
							<strong>Phone:</strong> +234 803 569 6810
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
