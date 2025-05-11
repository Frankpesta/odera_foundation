import type React from "react";
import type { Metadata } from "next";
import { Mona_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: {
		default: "ODERA HELPING HAND FOUNDATION",
		template: "%s | ODERA HELPING HAND FOUNDATION",
	},
	description:
		"Alleviating poverty, promoting education, advancing healthcare, fostering community development, and protecting the environment.",
	keywords: [
		"NGO",
		"charity",
		"foundation",
		"poverty alleviation",
		"education",
		"healthcare",
		"community development",
		"environmental protection",
	],
	authors: [{ name: "ODERA HELPING HAND FOUNDATION" }],
	creator: "ODERA HELPING HAND FOUNDATION",
	publisher: "ODERA HELPING HAND FOUNDATION",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://oderahelpinghand.org",
		siteName: "ODERA HELPING HAND FOUNDATION",
		title: "ODERA HELPING HAND FOUNDATION",
		description:
			"Alleviating poverty, promoting education, advancing healthcare, fostering community development, and protecting the environment.",
		images: [
			{
				url: "https://oderahelpinghand.org/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "ODERA HELPING HAND FOUNDATION",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ODERA HELPING HAND FOUNDATION",
		description:
			"Alleviating poverty, promoting education, advancing healthcare, fostering community development, and protecting the environment.",
		images: ["https://oderahelpinghand.org/og-image.jpg"],
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange>
					<div className="">{children}</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
