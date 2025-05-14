import type React from "react";
import type { Metadata } from "next";
import { Mona_Sans as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
});

export const metadata: Metadata = {
	title: {
		default: "Odera Helping Hands Foundation",
		template: "%s | Odera Helping Hands Foundation",
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
	authors: [{ name: "Odera Helping Hands Foundation" }],
	creator: "Odera Helping Hands Foundation",
	publisher: "Odera Helping Hands Foundation",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://oderahelpinghandsfoundation.org",
		siteName: "Odera Helping Hands Foundation",
		title: "Odera Helping Hands Foundation",
		description:
			"Alleviating poverty, promoting education, advancing healthcare, fostering community development, and protecting the environment.",
		images: [
			{
				url: "https://oderahelpinghandsfoundation.org/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Odera Helping Hands Foundation",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Odera Helping Hands Foundation",
		description:
			"Alleviating poverty, promoting education, advancing healthcare, fostering community development, and protecting the environment.",
		images: ["https://oderahelpinghandsfoundation.org/og-image.jpg"],
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
					<div className="">
						<Providers>{children}</Providers>
					</div>
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
