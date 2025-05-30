"use client";

import { useState, useEffect, useRef } from "react";
import anime from "animejs"; // Correct import for latest animejs

interface ImpactCounterProps {
	end: number;
	duration?: number;
	formatter?: (value: number) => string;
}

export default function ImpactCounter({
	end,
	duration = 2000,
	formatter = (value) => value.toLocaleString(),
}: ImpactCounterProps) {
	const countRef = useRef<HTMLSpanElement>(null);
	const hasAnimated = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && !hasAnimated.current) {
					hasAnimated.current = true;

					const animatedObj = { value: 0 };
					anime({
						targets: animatedObj, // Animate a plain object
						value: end,
						easing: "easeInOutExpo",
						duration: duration,
						round: 1,
						update: () => {
							if (countRef.current) {
								const currentValue = Math.floor(animatedObj.value);
								countRef.current.innerHTML = formatter(currentValue);
							}
						},
					});
				}
			},
			{ threshold: 0.1 }
		);

		if (countRef.current) {
			observer.observe(countRef.current);
		}

		return () => observer.disconnect();
	}, [end, duration, formatter]);

	return (
		<div className="text-4xl font-bold text-emerald-600">
			<span ref={countRef}>0</span>
			<span className="text-2xl">+</span>
		</div>
	);
}
