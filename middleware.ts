import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { NextRequest } from "next/server";

export default withAuth(
	async function middleware(request: NextRequest) {
		// Optional: Add custom logic here (e.g., role checks)
	},
	{
		isReturnToCurrentPage: true, // Redirects back to /admin after login
	}
);

export const config = {
	matcher: ["/admin/:path*"], // Protects ALL routes under /admin
};
