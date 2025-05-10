"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
	text: string;
	className?: string;
	once?: boolean;
}

export default function AnimatedText({
	text,
	className = "",
	once = true,
}: AnimatedTextProps) {
	const [scope, animate] = useState(true);

	// Split text into words
	const words = text.split(" ");

	// Animation variants for the container
	const container = {
		hidden: { opacity: 0 },
		visible: (i = 1) => ({
			opacity: 1,
			transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
		}),
	};

	// Animation variants for each word
	const child = {
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 12,
				stiffness: 100,
			},
		},
		hidden: {
			opacity: 0,
			y: 20,
			transition: {
				type: "spring",
				damping: 12,
				stiffness: 100,
			},
		},
	};

	useEffect(() => {
		if (!once) {
			const interval = setInterval(() => {
				animate(false);
				setTimeout(() => animate(true), 500);
			}, 7000);
			return () => clearInterval(interval);
		}
	}, [once]);

	return (
		<motion.div
			className={`overflow-hidden ${className}`}
			variants={container}
			initial="hidden"
			animate={scope ? "visible" : "hidden"}>
			{words.map((word, index) => (
				<motion.span key={index} className="mr-1 inline-block" variants={child}>
					{word}
				</motion.span>
			))}
		</motion.div>
	);
}
