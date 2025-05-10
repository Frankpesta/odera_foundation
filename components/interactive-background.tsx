"use client";

import { useRef, useEffect } from "react";

interface InteractiveBackgroundProps {
	color?: string;
}

export default function InteractiveBackground({
	color = "#10b981",
}: InteractiveBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let width = (canvas.width = window.innerWidth);
		let height = (canvas.height = window.innerHeight);

		const particlesArray: Particle[] = [];
		const particleCount = 100;
		let hue = 0;

		class Particle {
			x: number;
			y: number;
			size: number;
			speedX: number;
			speedY: number;
			color: string;

			constructor() {
				this.x = Math.random() * width;
				this.y = Math.random() * height;
				this.size = Math.random() * 5 + 1;
				this.speedX = Math.random() * 3 - 1.5;
				this.speedY = Math.random() * 3 - 1.5;
				this.color = color;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				if (this.size > 0.2) this.size -= 0.1;

				// Boundary check
				if (this.x < 0 || this.x > width) this.speedX *= -1;
				if (this.y < 0 || this.y > height) this.speedY *= -1;
			}

			draw() {
				if (!ctx) return;
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		const init = () => {
			for (let i = 0; i < particleCount; i++) {
				particlesArray.push(new Particle());
			}
		};

		const handleParticles = () => {
			for (let i = 0; i < particlesArray.length; i++) {
				particlesArray[i].update();
				particlesArray[i].draw();

				// Connect particles with lines if they're close enough
				for (let j = i; j < particlesArray.length; j++) {
					const dx = particlesArray[i].x - particlesArray[j].x;
					const dy = particlesArray[i].y - particlesArray[j].y;
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < 100) {
						if (!ctx) return;
						ctx.beginPath();
						ctx.strokeStyle = `rgba(16, 185, 129, ${1 - distance / 100})`;
						ctx.lineWidth = 0.2;
						ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
						ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
						ctx.stroke();
						ctx.closePath();
					}
				}

				if (particlesArray[i].size <= 0.3) {
					particlesArray.splice(i, 1);
					i--;
					particlesArray.push(new Particle());
				}
			}
		};

		const animate = () => {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			handleParticles();
			hue += 0.5;
			requestAnimationFrame(animate);
		};

		const handleResize = () => {
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);
		init();
		animate();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [color]);

	return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}
