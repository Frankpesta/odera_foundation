"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function ModernHero() {
	const heroRef = useRef<HTMLDivElement>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { scrollY } = useScroll();
	const y1 = useTransform(scrollY, [0, 500], [0, 100]);
	const y2 = useTransform(scrollY, [0, 500], [0, -100]);
	const opacity = useTransform(scrollY, [0, 300], [1, 0]);

	const [titleRef, titleInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});

	const [subtitleRef, subtitleInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
		delay: 300,
	});

	const [ctaRef, ctaInView] = useInView({
		triggerOnce: true,
		threshold: 0.1,
		delay: 600,
	});

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!heroRef.current) return;
			const { left, top, width, height } =
				heroRef.current.getBoundingClientRect();
			const x = (e.clientX - left) / width - 0.5;
			const y = (e.clientY - top) / height - 0.5;
			setMousePosition({ x, y });
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const handleScrollDown = () => {
		window.scrollTo({
			top: window.innerHeight,
			behavior: "smooth",
		});
	};

	return (
		<section
			ref={heroRef}
			className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800">
			{/* Background Elements */}
			<div className="absolute inset-0 z-0">
				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-950/70"></div>

				{/* Animated Circles */}
				<div className="absolute inset-0 overflow-hidden">
					{[...Array(5)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute rounded-full bg-emerald-500/10"
							style={{
								width: `${Math.random() * 300 + 100}px`,
								height: `${Math.random() * 300 + 100}px`,
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								x: mousePosition.x * (i + 1) * 10,
								y: mousePosition.y * (i + 1) * 10,
							}}
							animate={{
								scale: [1, 1.1, 1],
								opacity: [0.1, 0.2, 0.1],
							}}
							transition={{
								duration: 8,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: "reverse",
								delay: i * 0.5,
							}}
						/>
					))}
				</div>

				{/* Mesh Grid */}
				<div className="absolute inset-0 opacity-20">
					<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern
								id="grid"
								width="40"
								height="40"
								patternUnits="userSpaceOnUse">
								<path
									d="M 40 0 L 0 0 0 40"
									fill="none"
									stroke="white"
									strokeWidth="0.5"
								/>
							</pattern>
						</defs>
						<rect width="100%" height="100%" fill="url(#grid)" />
					</svg>
				</div>

				{/* Parallax Images */}
				<motion.div
					className="absolute -right-20 top-1/4 h-64 w-64 rounded-full opacity-20"
					style={{ y: y1 }}>
					<Image
						src="/placeholder.svg?height=400&width=400"
						alt="Decorative"
						fill
						className="object-cover rounded-full"
					/>
				</motion.div>

				<motion.div
					className="absolute -left-10 bottom-1/4 h-80 w-80 rounded-full opacity-20"
					style={{ y: y2 }}>
					<Image
						src="/placeholder.svg?height=400&width=400"
						alt="Decorative"
						fill
						className="object-cover rounded-full"
					/>
				</motion.div>
			</div>

			{/* Content */}
			<div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-white">
				<motion.div
					ref={titleRef}
					initial={{ opacity: 0, y: 30 }}
					animate={titleInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8, ease: "easeOut" }}
					className="mb-4 text-center">
					<h1 className="font-sans text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
						<span className="block">ODERA</span>
						<span className="mt-2 block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
							HELPING HAND
						</span>
						<span className="mt-2 block">FOUNDATION</span>
					</h1>
				</motion.div>

				<motion.p
					ref={subtitleRef}
					initial={{ opacity: 0, y: 20 }}
					animate={subtitleInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
					className="mx-auto mb-8 max-w-2xl text-center text-xl text-emerald-100">
					Transforming lives through compassion, education, and sustainable
					development
				</motion.p>

				<motion.div
					ref={ctaRef}
					initial={{ opacity: 0, y: 20 }}
					animate={ctaInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
					className="flex flex-wrap justify-center gap-4">
					<Button
						asChild
						size="lg"
						className="relative overflow-hidden bg-emerald-600 text-white transition-all hover:bg-emerald-700">
						<Link href="/donate">
							<span className="relative z-10">Donate Now</span>
							<span className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
						</Link>
					</Button>

					<Button
						asChild
						size="lg"
						variant="outline"
						className="border-emerald-400 text-emerald-100 backdrop-blur-sm transition-all hover:bg-emerald-800/30">
						<Link href="/get-involved">Get Involved</Link>
					</Button>
				</motion.div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
				onClick={handleScrollDown}
				style={{ opacity }}
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
				<ChevronDown className="h-10 w-10 text-white/70" />
			</motion.div>

			{/* Animated Highlight Line */}
			<motion.div
				className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400"
				initial={{ width: "0%" }}
				animate={{ width: "100%" }}
				transition={{ duration: 1.5, delay: 1 }}
			/>
		</section>
	);
}
