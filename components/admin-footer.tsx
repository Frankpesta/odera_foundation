"use client";
import React from "react";

const AdminFooter = () => {
	const currentYear = new Date().getFullYear();
	return (
		<footer className="flex items-center justify-center bg-muted py-2 top-100 container rounded-md">
			<span className="text-sm text-muted-foreground">
				Odera Helping Hands Foundation &copy; {currentYear}
			</span>
		</footer>
	);
};

export default AdminFooter;
