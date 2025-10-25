"use client";

import { BookOpen, TrendingUp, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { HoursSpent } from "@/components/dashboard/HoursSpent";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import ActivityList from "@/components/dashboard/ActivityList";

export default function DashboardPage() {
	const { data: session } = useSession();
	const studyHours = 12;
	const currentHour = new Date().getHours();
	const greeting = currentHour >= 18 ? "Good Evening" : currentHour >= 12 ? "Good Afternoon" : "Good Morning";

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl lg:text-4xl font-bold text-white">
						{greeting}, {session?.user?.name?.trim()?.split(" ")[0]}! 👋
					</h1>
					<p className="text-gray-400">
						You studied <span className="font-semibold text-primary">{studyHours} hours</span> this week, track your
						learning activity
					</p>
					<p className="text-sm">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
				</div>
				<Link href="/dashboard/activities/form">
					<Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">Add New Activity</Button>
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<StatCard
					title="Total Hours"
					value="29.7"
					subValue="h"
					change="+3h this period"
					trend="up"
					icon={Clock}
					gradient="from-purple-500 to-pink-500"
				/>
				<StatCard
					title="Avg Understanding"
					value="12"
					subValue="%"
					change="+2% this week"
					trend="up"
					icon={BookOpen}
					gradient="from-blue-500 to-cyan-500"
				/>
				<StatCard
					title="Most Common Activity"
					value="Coding"
					subValue="18.2 h"
					change="Primary focus"
					trend="up"
					icon={TrendingUp}
					gradient="from-orange-500 to-red-500"
				/>
			</div>

			{/* Hours Spent Chart */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Hours Spent Chart - 2/3 width */}
				<div className="lg:col-span-2">
					<HoursSpent />
				</div>

				{/* Activity List - 1/3 width */}
				<div className="lg:col-span-1">
					<ActivityList />
				</div>
			</div>
		</div>
	);
}
