"use client";

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
    useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard, ClipboardList, User, BarChart3, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ShinyText from "../animation/ShinyText";
import { signOut } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const menuGroups = {
    general: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    ],
    learning: [{ icon: ClipboardList, label: "Activities", href: "/dashboard/activities" }],
    account: [
        { icon: User, label: "Profile", href: "/dashboard/profile" },
        { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ],
};

export default function AppSidebar() {
    const pathname = usePathname();
    const { open } = useSidebar();

    return (
        <Sidebar collapsible="icon" className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
            <SidebarHeader className="py-8">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-200 to-white flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-4 h-4 text-black" />
                    </div>
                    {open && <ShinyText text="Learnalyzer" disabled={false} speed={5} className="text-xl font-bold" />}
                </div>
            </SidebarHeader>

            <SidebarContent className="py-4">
                {/* General Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">General</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuGroups.general.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={`
                                                group relative rounded-full transition-all duration-200 h-10 px-4
                                                ${isActive
                                                    ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 text-white border border-purple-500/30 hover:from-purple-900/30 hover:to-blue-900/30"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }
                                            `}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : ""}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-purple-400"></div>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Learning Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">
                        Learning
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuGroups.learning.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={`
                                                group relative rounded-full transition-all duration-200 h-10 px-4
                                                ${isActive
                                                    ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 text-white border border-purple-500/30 hover:from-purple-900/30 hover:to-blue-900/30"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }
                                            `}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : ""}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-purple-400"></div>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Account Section */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider mb-2">Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuGroups.account.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.label}
                                            className={`
                                                group relative rounded-full transition-all duration-200 h-10 px-4
                                                ${isActive
                                                    ? "bg-gradient-to-r from-purple-900/20 to-blue-900/20 text-white border border-purple-500/30 hover:from-purple-900/30 hover:to-blue-900/30"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }
                                            `}
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : ""}`} />
                                                <span className="text-sm font-medium">{item.label}</span>
                                                {isActive && <div className="ml-auto w-2 h-2 rounded-full bg-purple-400"></div>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-white/10 p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <SidebarMenuButton
                                    tooltip="Sign Out"
                                    className="h-10 text-red-400 bg-red-500/10 hover:text-red-500 hover:bg-red-500/20 border-transparent rounded-xl transition-all"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </SidebarMenuButton>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to log out?
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => signOut({ redirect: true, callbackUrl: "/auth/sign-in" })}
                                        className="bg-red-500 hover:bg-red-700 text-white transition-colors"
                                    >
                                        Confirm
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
