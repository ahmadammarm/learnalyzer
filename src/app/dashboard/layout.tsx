"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<div className="pt-6 min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-950 text-white flex w-full">
				<AppSidebar />
				<div className="flex-1 flex flex-col w-full">
					<Header />
					<main className="flex-1 p-6 lg:p-8 overflow-auto">{children}</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
