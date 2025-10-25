"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const monthlyData = [
	{ month: "Jan", hours: 18, minutes: 30 },
	{ month: "Feb", hours: 15, minutes: 45 },
	{ month: "Mar", hours: 12, minutes: 20 },
	{ month: "Apr", hours: 22, minutes: 10 },
	{ month: "May", hours: 19, minutes: 50 },
	{ month: "Jun", hours: 26, minutes: 47 },
	{ month: "Jul", hours: 14, minutes: 30 },
	{ month: "Aug", hours: 17, minutes: 15 },
	{ month: "Sep", hours: 20, minutes: 40 },
	{ month: "Oct", hours: 16, minutes: 25 },
	{ month: "Nov", hours: 18, minutes: 55 },
	{ month: "Dec", hours: 15, minutes: 10 },
];

const weeklyData = [
	{ month: "Mon", hours: 4, minutes: 30 },
	{ month: "Tue", hours: 5, minutes: 15 },
	{ month: "Wed", hours: 3, minutes: 45 },
	{ month: "Thu", hours: 6, minutes: 20 },
	{ month: "Fri", hours: 5, minutes: 50 },
	{ month: "Sat", hours: 2, minutes: 10 },
	{ month: "Sun", hours: 3, minutes: 30 },
];

const dailyData = [
	{ month: "Today", hours: 2, minutes: 30 },
	{ month: "Yesterday", hours: 4, minutes: 15 },
	{ month: "2 days ago", hours: 3, minutes: 45 },
	{ month: "3 days ago", hours: 5, minutes: 20 },
	{ month: "4 days ago", hours: 2, minutes: 50 },
	{ month: "5 days ago", hours: 3, minutes: 10 },
	{ month: "6 days ago", hours: 4, minutes: 30 },
];

export function HoursSpent() {
	const [period, setPeriod] = useState<"year" | "month" | "week">("year");
	const [year, setYear] = useState(2022);
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	const getData = () => {
		switch (period) {
			case "week":
				return weeklyData;
			case "month":
				return dailyData;
			default:
				return monthlyData;
		}
	};

	const data = getData();
	const totalHours = data.reduce((sum, item) => sum + item.hours, 0);
	const totalMinutes = data.reduce((sum, item) => sum + item.minutes, 0);
	const displayMinutes = totalMinutes % 60;
	const additionalHours = Math.floor(totalMinutes / 60);
	const finalHours = totalHours + additionalHours;

	const maxValue = Math.max(...data.map((item) => item.hours + item.minutes / 60));

	const CustomTooltip = ({ active, payload }: any) => {
		if (active && payload && payload.length) {
			const data = payload[0].payload;
			return (
				<div className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900">
					{data.hours}h {data.minutes}m
				</div>
			);
		}
		return null;
	};

	return (
		<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-950 to-gray-900 p-8 backdrop-blur-xl">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold text-white">Hours spent</h2>
				</div>

				<div className="flex items-center gap-6">
					{/* Year Navigation */}
					<div className="flex items-center gap-4">
						<button onClick={() => setYear(year - 1)} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
							<ChevronLeft className="h-5 w-5 text-white/60" />
						</button>
						<span className="w-16 text-center text-xl font-semibold text-white">{year}</span>
						<button onClick={() => setYear(year + 1)} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
							<ChevronRight className="h-5 w-5 text-white/60" />
						</button>
					</div>

					{/* Period Selector */}
					<div className="flex gap-3">
						{(["Year", "Month", "Week"] as const).map((label) => (
							<button
								key={label}
								onClick={() => setPeriod(label.toLowerCase() as "year" | "month" | "week")}
								className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
									period === label.toLowerCase()
										? "bg-purple-500/20 text-purple-300"
										: "text-white/60 hover:text-white/80"
								}`}
							>
								{label}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Stats Display */}
			<div className="mb-8">
				<div className="flex items-baseline gap-2">
					<span className="text-3xl font-semibold text-white">
						{finalHours}
						<span className="text-2xl text-white/50 font-light">H</span>
					</span>
					<span className="text-3xl font-semibold text-white">
						{displayMinutes}
						<span className="text-2xl text-white/50 font-light">M</span>
					</span>
					<span className="text-lg text-white/50">on this period</span>
				</div>
			</div>

			{/* Chart */}
			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
						<XAxis
							dataKey="month"
							stroke="rgba(255,255,255,0.4)"
							style={{ fontSize: "12px" }}
							tick={{ fill: "rgba(255,255,255,0.6)" }}
						/>
						<YAxis
							stroke="rgba(255,255,255,0.4)"
							style={{ fontSize: "12px" }}
							tick={{ fill: "rgba(255,255,255,0.6)" }}
							label={{ value: "Hours", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.6)" }}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(155, 92, 255, 0.1)" }} />
						<Bar
							dataKey="hours"
							fill="rgba(155, 92, 255, 0.3)"
							radius={[8, 8, 0, 0]}
							onMouseEnter={(_, index) => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
						>
							{data.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={hoveredIndex === index ? "#06b6d4" : "rgba(155, 92, 255, 0.3)"} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
