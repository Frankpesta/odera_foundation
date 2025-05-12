import {
	Calendar,
	Home,
	Inbox,
	Newspaper,
	LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";

// Menu items.
const items = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "Dashboard",
		url: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Events",
		url: "/admin/events",
		icon: Calendar,
	},
	{
		title: "Contacts",
		url: "/admin/contacts",
		icon: Inbox,
	},
	{
		title: "Newsletter",
		url: "/admin/newsletter",
		icon: Newspaper,
	},
];

export function AppSidebar() {
	return (
		<Sidebar side="left" variant="sidebar" collapsible="offcanvas">
			<SidebarHeader className="py-12">
				<div className="flex items-center space-x-2">
					<img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
					<span className="text-lg font-bold">Admin Panel</span>
				</div>
			</SidebarHeader>
			<SidebarContent className="px-4 py-2">
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title} className="py-4">
							<SidebarMenuButton asChild>
								<Link href={item.url} className="flex items-center space-x-2">
									<item.icon className="text-primary" />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<Button asChild>
					<LogoutLink>LogOut</LogoutLink>
				</Button>
			</SidebarFooter>
		</Sidebar>
	);
}
