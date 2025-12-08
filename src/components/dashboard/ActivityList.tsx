"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";

interface Activity {
	id: string;
	title: string;
	description: string;
	participants: string[];
	time: string;
	date: Date;
}

// Dummy data for demonstration
const dummyActivities: Activity[] = [
	{
		id: "1",
		title: "Review Mid Test",
		description: "Lecture must checking progress t...",
		participants: ["user1", "user2", "user3"],
		time: "09:00 AM",
		date: new Date(2024, 9, 28),
	},
	{
		id: "2",
		title: "Ceremony Yudisium",
		description: "Make sure event for student can w...",
		participants: ["user1", "user2", "user3", "user4"],
		time: "10:45 AM",
		date: new Date(2024, 9, 28),
	},
	{
		id: "3",
		title: "JavaScript Workshop",
		description: "Advanced ES6 features and patterns",
		participants: ["user1", "user2"],
		time: "02:00 PM",
		date: new Date(2024, 9, 25),
	},
];

export default function ActivityList() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState(new Date());

	// Get week dates
	const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
	const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

	// Navigate months
	const goToPreviousWeek = () => {
		setCurrentDate(subWeeks(currentDate, 1));
	};

	const goToNextWeek = () => {
		setCurrentDate(addWeeks(currentDate, 1));
	};

	// Filter activities by selected date
	const selectedActivities = dummyActivities.filter(
		(activity) => format(activity.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
	);

	const isToday = (date: Date) => {
		return format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
	};

	const isSelected = (date: Date) => {
		return format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
	};

	return (
		<div className="rounded-2xl border border-white/10 bg-gradient-to-br from-gray-950 to-gray-900 p-6 backdrop-blur-xl h-full flex flex-col">
			{/* Month/Year Header */}
			<div className="flex items-center justify-between mb-6">
				<button onClick={goToPreviousWeek} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
					<ChevronLeft className="h-5 w-5 text-white/60" />
				</button>
				<h2 className="text-xl font-semibold text-white">{format(currentDate, "MMMM yyyy")}</h2>
				<button onClick={goToNextWeek} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
					<ChevronRight className="h-5 w-5 text-white/60" />
				</button>
			</div>

			{/* Week Day Labels */}
			<div className="grid grid-cols-7 gap-2 mb-3">
				{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
					<div key={day} className="text-center text-xs text-white/40 font-medium">
						{day}
					</div>
				))}
			</div>

			{/* Date Selector */}
			<div className="grid grid-cols-7 gap-2 mb-6">
				{weekDates.map((date, index) => (
					<button
						key={index}
						onClick={() => setSelectedDate(date)}
						className={cn(
							"aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200",
							isSelected(date)
								? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/30 scale-110"
								: isToday(date)
								? "bg-white/10 text-white ring-2 ring-purple-400/50"
								: "text-white/60 hover:bg-white/5 hover:text-white"
						)}
					>
						{format(date, "d")}
					</button>
				))}
			</div>

			{/* Activities List */}
			<div className="flex-1 overflow-y-auto space-y-3 mb-6 scrollbar-thin">
				{selectedActivities.length > 0 ? (
					selectedActivities.map((activity) => (
						<div
							key={activity.id}
							className="rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-4 hover:border-purple-500/40 transition-all duration-200 cursor-pointer group"
						>
							<div className="flex items-start justify-between mb-2">
								<h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
									{activity.title}
								</h3>
								<button className="text-white/40 hover:text-white transition-colors">
									<MoreVertical className="w-4 h-4" />
								</button>
							</div>
							<p className="text-sm text-white/60 mb-3 line-clamp-1">{activity.description}</p>
							<div className="flex items-center justify-between">
								{/* Participants */}
								<div className="flex -space-x-2">
									{activity.participants.map((_, idx) => (
										<div
											key={idx}
											className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-gray-900 flex items-center justify-center"
										>
											<span className="text-xs font-medium text-white">{String.fromCharCode(65 + idx)}</span>
										</div>
									))}
								</div>
								{/* Time */}
								<div className="flex items-center gap-1.5 text-white/60">
									<Clock className="w-3.5 h-3.5" />
									<span className="text-xs font-medium">{activity.time}</span>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
							<Clock className="w-8 h-8 text-white/20" />
						</div>
						<p className="text-white/40 text-sm">No activities on this day</p>
					</div>
				)}
			</div>

			{/* Create Activity Button */}
			<Button className="w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/30 text-white font-medium rounded-xl h-12 transition-all duration-200 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20">
				<Plus className="w-5 h-5 mr-2" />
				Add Activity
			</Button>
		</div>
	);
}
