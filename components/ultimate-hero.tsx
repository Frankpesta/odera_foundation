"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import HeroParticles from "./hero-particles";
import AnimatedText from "./animated-text";
import InteractiveBackground from "./interactive-background";

export default function UltimateHero() {
	const heroRef = useRef<HTMLDivElement>(null);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const { scrollY } = useScroll();
	const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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

	// Text animation variants
	const titleVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	const buttonVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: "easeOut",
				delay: 0.8,
			},
		},
		hover: {
			scale: 1.05,
			transition: { duration: 0.2 },
		},
		tap: {
			scale: 0.95,
			transition: { duration: 0.2 },
		},
	};

	return (
		<section ref={heroRef} className="relative h-screen w-full overflow-hidden">
			{/* Interactive Background */}
			<InteractiveBackground />

			{/* 3D Particle Effect */}
			<HeroParticles />

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/30 to-emerald-950/70 z-10"></div>

			{/* Content */}
			<div className="container relative z-20 flex h-full flex-col items-center justify-center px-4 text-white">
				<motion.div
					initial="hidden"
					animate="visible"
					className="mb-6 text-center">
					<motion.div variants={titleVariants} className="overflow-hidden">
						<h1 className="font-sans text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl mb-2">
							<span className="block">ODERA</span>
						</h1>
					</motion.div>

					<motion.div
						variants={titleVariants}
						className="overflow-hidden"
						transition={{ delay: 0.2 }}>
						<h1 className="font-sans text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl mb-2">
							<span className="block bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
								HELPING HANDS
							</span>
						</h1>
					</motion.div>

					<motion.div
						variants={titleVariants}
						className="overflow-hidden"
						transition={{ delay: 0.4 }}>
						<h1 className="font-sans text-4xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
							<span className="block">FOUNDATION</span>
						</h1>
					</motion.div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="mb-10">
					<AnimatedText
						text="Transforming lives through compassion, education, and sustainable development"
						className="mx-auto max-w-2xl text-center text-xl text-emerald-100"
					/>
				</motion.div>

				<motion.div
					className="flex flex-wrap justify-center gap-6"
					variants={buttonVariants}
					initial="hidden"
					animate="visible">
					<motion.div whileHover="hover" whileTap="tap">
						<Button
							asChild
							size="lg"
							className="relative overflow-hidden bg-emerald-600 text-white transition-all hover:bg-emerald-700 text-lg px-8 py-2 h-auto">
							<Link href="/donate">
								<span className="relative z-10">Donate Now</span>
								<span className="absolute inset-0 -z-0 bg-gradient-to-r from-emerald-500 to-emerald-600 opacity-0 transition-opacity duration-300 hover:opacity-100"></span>
							</Link>
						</Button>
					</motion.div>
				</motion.div>
			</div>

			{/* Scroll Indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
				onClick={handleScrollDown}
				style={{ opacity }}
				animate={{ y: [0, 10, 0] }}
				transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
				<ChevronDown className="h-10 w-10 text-white/70" />
			</motion.div>

			{/* Animated Border */}
			<div className="absolute bottom-0 left-0 right-0 z-20">
				<motion.div
					className="h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400"
					initial={{ width: "0%" }}
					animate={{ width: "100%" }}
					transition={{ duration: 1.5, delay: 1.2 }}
				/>
			</div>
		</section>
	);
}
