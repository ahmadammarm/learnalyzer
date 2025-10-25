"use client";

import { useSession } from "next-auth/react";
import { SidebarTrigger } from "../ui/sidebar";

export default function Header() {
	const { data: session } = useSession();

	return (
		<header className="h-16 lg:h-20 shadow-xl mx-4 rounded-full bg-gray-900/50 backdrop-blur-md sticky top-6 z-30">
			<div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
				{/* Left Section */}
				<div className="flex items-center gap-4">
					{/* Sidebar Toggle */}
					<SidebarTrigger className="text-gray-400 hover:text-white hover:bg-white/5 w-10 h-10 rounded-full transition-all" />

					<div className="border-l border-white/10 pl-4">
						<h1 className="text-xl font-semibold text-white">Dashboard</h1>
					</div>
				</div>

				{/* Right Section */}
				<div className="flex items-center gap-3">
					{/* User Profile */}
					<div className="flex items-center gap-3 pl-3 border-l border-white/10">
						<div className="hidden lg:block text-right">
							<p className="text-sm font-medium text-white">{session?.user?.name || "User"}</p>
							<p className="text-xs text-gray-400">{session?.user?.email || ""}</p>
						</div>
						<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
							<span className="text-sm font-semibold text-black">
								{session?.user?.name?.charAt(0).toUpperCase() || "U"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
