import type React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="">
			<Header />
			{children}
			<Footer />
		</div>
	);
}
