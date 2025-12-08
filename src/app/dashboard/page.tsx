/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookOpen, AlertTriangle, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	ScatterChart,
	Scatter,
} from "recharts";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

const formatDate = (date: string | number | Date) => {
	const d = new Date(date);
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	return {
		short: `${months[d.getMonth()]} ${d.getDate()}`,
		long: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
		time: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d
			.getMinutes()
			.toString()
			.padStart(2, "0")}`,
	};
};

export default function FatigueDashboardPage() {
	const { data: session } = useSession();

	const fatigueQuery = useQuery({
		queryKey: ["statistics"],
		queryFn: async () => {
			const response = await fetch("/api/statistics");
			if (!response.ok) {
				throw new Error("Failed to fetch fatigue data");
			}
			return response.json();
		},
	});

	const data = fatigueQuery.data;

	const currentHour = new Date().getHours();
	const greeting = currentHour >= 18 ? "Good Evening" : currentHour >= 12 ? "Good Afternoon" : "Good Morning";

	// Process data for charts
	const avgFatigueValue =
		data?.avgFatiguePerCourse?.length > 0
			? (
					data.avgFatiguePerCourse.reduce(
						(sum: any, item: { _avg: { stress_level: any } }) => sum + (item._avg.stress_level || 0),
						0
					) / data.avgFatiguePerCourse.length
			  ).toFixed(1)
			: 0;

	const mostCommonLoad = data?.cognitiveLoadDistribution?.reduce((prev: any, current: any) =>
		prev._count.perceived_cognitive_load > current._count.perceived_cognitive_load ? prev : current
	);

	const weeklyTrendData =
		data?.anomalies?.length > 0
			? (() => {
					const weekMap = new Map();
					data.anomalies.forEach((item: any) => {
						const week = formatDate(item.date).short;
						if (!weekMap.has(week)) {
							weekMap.set(week, { total: 0, count: 0 });
						}
						weekMap.get(week).total += item.stress_level;
						weekMap.get(week).count += 1;
					});
					return Array.from(weekMap.entries())
						.map(([week, data]: [string, any]) => ({
							date: week,
							fatigue: (data.total / data.count).toFixed(1),
						}))
						.slice(0, 7);
			  })()
			: [];

	const cognitiveLoadData =
		data?.cognitiveLoadDistribution
			?.sort((a: any, b: any) => a.perceived_cognitive_load - b.perceived_cognitive_load)
			.map((item: { perceived_cognitive_load: any; _count: { perceived_cognitive_load: any } }) => ({
				load: `Level ${item.perceived_cognitive_load}`,
				count: item._count.perceived_cognitive_load,
			})) || [];

	// Low attention courses (lowest quiz scores)
	const lowAttentionData =
		data?.lowAttentionCourses
			?.sort((a: any, b: any) => a._avg.quiz_score - b._avg.quiz_score)
			.slice(0, 5)
			.map((item: { course_id: any; _avg: { quiz_score: any } }) => ({
				course: item.course_id,
				score: parseFloat(item._avg.quiz_score).toFixed(1),
			})) || [];

	// Duration vs Fatigue correlation data
	const correlationData =
		data?.correlationData?.map((item: any) => ({
			sessionduration: item.duration_minutes,
			fatiguelevel: item.stress_level,
		})) || [];

	// Additional analytics: Average duration by stress level
	const stressByDuration =
		data?.correlationData?.length > 0
			? (() => {
					const durationMap = new Map();
					data.correlationData.forEach((item: any) => {
						const bucket = Math.floor(item.duration_minutes / 15) * 15;
						if (!durationMap.has(bucket)) {
							durationMap.set(bucket, { total: 0, count: 0 });
						}
						durationMap.get(bucket).total += item.stress_level;
						durationMap.get(bucket).count += 1;
					});
					return Array.from(durationMap.entries())
						.map(([duration, data]: [number, any]) => ({
							duration: `${duration}min`,
							avgStress: (data.total / data.count).toFixed(1),
						}))
						.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
			  })()
			: [];

	const COLORS = [
		"#8b5cf6",
		"#ec4899",
		"#f59e0b",
		"#10b981",
		"#3b82f6",
		"#ef4444",
		"#14b8a6",
		"#f97316",
		"#84cc16",
		"#a855f7",
	];

	return (
		<div className="space-y-6">
			{/* Welcome Section */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl lg:text-4xl font-bold text-white">
						{greeting}, {session?.user?.name?.trim()?.split(" ")[0]}! 👋
					</h1>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-5 w-96 rounded-md" />
					) : (
						<p className="text-gray-400">
							Average fatigue level: <span className="font-semibold text-primary">{avgFatigueValue}/10</span> - Monitor
							your learning wellness
						</p>
					)}
					<p className="text-sm text-gray-500">{formatDate(new Date()).long}</p>
				</div>
				<Link href="/dashboard/learning-fatugue-data">
					<Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">Go to Data Table</Button>
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{fatigueQuery.isPending ? (
					<>
						<Skeleton className="h-40 w-full rounded-2xl" />
						<Skeleton className="h-40 w-full rounded-2xl" />
						<Skeleton className="h-40 w-full rounded-2xl" />
						<Skeleton className="h-40 w-full rounded-2xl" />
					</>
				) : (
					<>
						<StatCard
							title="Avg Fatigue Level"
							value={parseFloat(avgFatigueValue as string)}
							subValue="/10"
							change="Across all courses"
							trend={parseFloat(avgFatigueValue as string) < 5 ? "up" : "down"}
							icon={Activity}
							gradient="from-purple-500 to-pink-500"
						/>
						<StatCard
							title="Active Courses"
							value={data?.avgFatiguePerCourse?.length || 0}
							subValue=""
							change="Being monitored"
							trend="up"
							icon={BookOpen}
							gradient="from-blue-500 to-cyan-500"
						/>
						<StatCard
							title="High Fatigue Alerts"
							value={data?.anomalies?.length || 0}
							subValue=""
							change="Sessions ≥9 stress"
							trend="down"
							icon={AlertTriangle}
							gradient="from-orange-500 to-red-500"
						/>
						<StatCard
							title="Most Common Load"
							value={mostCommonLoad?.perceived_cognitive_load || "N/A"}
							subValue=""
							change={`${mostCommonLoad?._count?.perceived_cognitive_load || 0} sessions`}
							trend="up"
							icon={Brain}
							gradient="from-green-500 to-emerald-500"
						/>
					</>
				)}
			</div>

			{/* Charts Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Course Performance Overview */}
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
					<h3 className="text-xl font-semibold text-white mb-4">Average Stress by Course</h3>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-64 w-full rounded-md" />
					) : (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={data?.avgFatiguePerCourse || []}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis dataKey="course_id" stroke="#9ca3af" />
								<YAxis stroke="#9ca3af" domain={[0, 10]} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
									formatter={(value: any) => [parseFloat(value).toFixed(2), "Avg Stress"]}
								/>
								<Bar dataKey="_avg.stress_level" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Cognitive Load Distribution */}
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
					<h3 className="text-xl font-semibold text-white mb-4">Cognitive Load Distribution</h3>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-64 w-full rounded-md" />
					) : (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={cognitiveLoadData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis dataKey="load" stroke="#9ca3af" />
								<YAxis stroke="#9ca3af" />
								<Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
								<Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Courses Needing Attention */}
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
					<h3 className="text-xl font-semibold text-white mb-4">Lowest Quiz Performance</h3>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-64 w-full rounded-md" />
					) : (
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={lowAttentionData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis dataKey="course" stroke="#9ca3af" />
								<YAxis stroke="#9ca3af" domain={[0, 100]} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
									formatter={(value: any) => [`${value}%`, "Avg Score"]}
								/>
								<Bar dataKey="score" fill="#ec4899" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Duration vs Fatigue Correlation */}
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
					<h3 className="text-xl font-semibold text-white mb-4">Duration vs Stress Level</h3>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-64 w-full rounded-md" />
					) : (
						<ResponsiveContainer width="100%" height={250}>
							<ScatterChart>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis dataKey="sessionduration" name="Duration (min)" stroke="#9ca3af" domain={[0, 100]} />
								<YAxis dataKey="fatiguelevel" name="Stress" stroke="#9ca3af" domain={[0, 10]} />
								<Tooltip
									contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }}
									cursor={{ strokeDasharray: "3 3" }}
								/>
								<Scatter name="Sessions" data={correlationData} fill="#10b981" />
							</ScatterChart>
						</ResponsiveContainer>
					)}
				</div>

				{/* Average Stress by Session Duration */}
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group lg:col-span-2">
					<h3 className="text-xl font-semibold text-white mb-4">Average Stress by Session Duration</h3>
					{fatigueQuery.isPending ? (
						<Skeleton className="h-64 w-full rounded-md" />
					) : (
						<ResponsiveContainer width="100%" height={250}>
							<LineChart data={stressByDuration}>
								<CartesianGrid strokeDasharray="3 3" stroke="#374151" />
								<XAxis dataKey="duration" stroke="#9ca3af" />
								<YAxis stroke="#9ca3af" domain={[0, 10]} />
								<Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", color: "#f3f4f6" }} />
								<Line type="monotone" dataKey="avgStress" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b" }} />
							</LineChart>
						</ResponsiveContainer>
					)}
				</div>
			</div>

			{/* Recent High Fatigue Alerts */}
			{!fatigueQuery.isPending && data?.anomalies?.length > 0 && (
				<div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 group">
					<h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
						<AlertTriangle className="text-orange-500" />
						Recent High Stress Sessions (≥9)
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
						{data.anomalies.slice(0, 6).map((anomaly: any, index: Key | null | undefined) => (
							<div key={index} className="bg-gray-800 rounded-lg p-4 border border-orange-500/20">
								<div className="flex items-center justify-between mb-2">
									<p className="text-white font-medium">{anomaly.course_id}</p>
									<span className="text-2xl font-bold text-orange-500">{anomaly.stress_level}/10</span>
								</div>
								<div className="space-y-1 text-sm text-gray-400">
									<p>📅 {formatDate(anomaly.date).short}</p>
									<p>⏱️ {anomaly.duration_minutes} min</p>
									<p>🧠 Cognitive Load: {anomaly.perceived_cognitive_load}</p>
									<p>📝 Quiz Score: {anomaly.quiz_score}%</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
