"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import anime from "animejs";

const navItems = [
	{ name: "Home", href: "/" },
	{ name: "About", href: "/about" },
	{ name: "Our Work", href: "/our-work" },
	{ name: "Events", href: "/events" },
	{ name: "Blog", href: "/blog" },
	{ name: "Contact", href: "/contact" },
];

export default function Header() {
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isOpen) {
			anime({
				targets: ".mobile-nav-item",
				translateX: [20, 0],
				opacity: [0, 1],
				delay: anime.stagger(100, { start: 100 }),
				easing: "easeOutQuad",
			});
		}
	}, [isOpen]);

	return (
		<header
			className={`sticky top-0 z-50 w-full transition-all duration-300 ${
				scrolled
					? "bg-background/80 backdrop-blur-md shadow-sm"
					: "bg-transparent"
			}`}>
			<div className="container flex h-16 items-center justify-between px-4">
				<Link href="/" className="flex items-center space-x-2">
					<span className="text-xl font-bold text-emerald-600">ODERA</span>
				</Link>

				<nav className="hidden md:flex items-center space-x-6">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
								pathname === item.href
									? "text-emerald-600"
									: "text-foreground/80"
							}`}>
							{item.name}
						</Link>
					))}
					<Button
						asChild
						className="bg-emerald-600 hover:bg-emerald-700 text-white">
						<Link href="/donate">Donate</Link>
					</Button>
					<ThemeToggle />
				</nav>

				<div className="flex items-center md:hidden space-x-2">
					<ThemeToggle />
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-[300px] sm:w-[400px] px-6">
							<div className="flex flex-col space-y-4 mt-8">
								{navItems.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className={`mobile-nav-item text-lg font-medium transition-colors hover:text-emerald-600 ${
											pathname === item.href
												? "text-emerald-600"
												: "text-foreground/80"
										}`}
										onClick={() => setIsOpen(false)}>
										{item.name}
									</Link>
								))}
								<Button
									asChild
									className="mobile-nav-item mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
									<Link href="/donate" onClick={() => setIsOpen(false)}>
										Donate
									</Link>
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
}
