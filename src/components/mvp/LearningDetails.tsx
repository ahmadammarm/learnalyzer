"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { buttonVariants } from "../ui/button";
import { ReceiptText, Clock, Brain, Target, Moon, Zap, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface LearningFatigueData {
	id: number;
	date: string;
	student_id: string;
	course_id: string;
	module_id: string;
	instruction_method: string;
	start_time: string;
	duration_minutes: number;
	mood_before: string;
	mood_after: string;
	stress_level: number;
	sleep_hours_prev_night: number;
	num_pauses: number;
	distraction_events: number;
	task_difficulty_rating: number;
	perceived_cognitive_load: number;
	quiz_score: number;
	num_attempts_quiz: number;
	time_to_complete_quiz_seconds: number;
	comprehension_confidence: number;
	opened_feedback: boolean;
	time_to_open_feedback_hours: number | null;
	created_at: string;
}

const formatDate = (date: string): string => {
	return new Date(date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const formatTime = (timeString: string): string => {
	const date = new Date(timeString);
	return date.toLocaleTimeString("id-ID", {
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatDuration = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes}m ${secs}s`;
};

interface DetailRowProps {
	label: string;
	value: string | number;
	icon?: React.ReactNode;
	badge?: boolean;
	badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

function DetailRow({ label, value, icon, badge, badgeVariant = "default" }: DetailRowProps) {
	return (
		<div className="flex items-center justify-between py-2">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				{icon}
				<span>{label}</span>
			</div>
			{badge ? <Badge variant={badgeVariant}>{value}</Badge> : <span className="font-medium">{value}</span>}
		</div>
	);
}

function MoodIndicator({ mood }: { mood: string }) {
	const getMoodColor = (mood: string) => {
		const moods: Record<string, string> = {
			happy: "text-green-500",
			neutral: "text-gray-500",
			tired: "text-yellow-500",
			stressed: "text-red-500",
		};
		return moods[mood.toLowerCase()] || "text-gray-500";
	};

	return (
		<div className="flex items-center gap-2">
			<span className={`font-medium capitalize ${getMoodColor(mood)}`}>{mood}</span>
		</div>
	);
}

function ProgressBar({ value, max = 10, label }: { value: number; max?: number; label: string }) {
	const percentage = (value / max) * 100;

	return (
		<div className="space-y-2">
			<div className="flex justify-between text-sm">
				<span className="text-muted-foreground">{label}</span>
				<span className="font-medium">
					{value}/{max}
				</span>
			</div>
			<div className="w-full bg-gray-200 rounded-full h-2.5">
				<div
					className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
					style={{ width: `${percentage}%` }}
				/>
			</div>
		</div>
	);
}

interface Props {
	data: LearningFatigueData;
}

export default function LearningDetails({ data }: Props) {
	return (
		<Dialog>
			<DialogTrigger
				className={buttonVariants({
					variant: "default",
					size: "icon",
					className: "rounded-full bg-transparent hover:bg-white/5 border border-white/20",
				})}
			>
				<ReceiptText className="h-4 w-4" />
			</DialogTrigger>
			<DialogContent
				className="min-w-1/3 max-h-[80vh] overflow-y-auto
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:rounded-full
                [&::-webkit-scrollbar-track]:bg-gray-100
                [&::-webkit-scrollbar-thumb]:rounded-full
                [&::-webkit-scrollbar-thumb]:bg-gray-300
                dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
			>
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Learning Session Details</DialogTitle>
					<DialogDescription>Detailed information about this learning session</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg flex items-center gap-2">
							<Clock className="h-5 w-5" />
							Session Information
						</h3>
						<div className="bg-muted/50 rounded-lg p-4 space-y-2">
							<DetailRow label="Date" value={formatDate(data.date)} />
							<DetailRow label="Start Time" value={formatTime(data.start_time)} />
							<DetailRow label="Duration" value={`${data.duration_minutes} minutes`} />
							<DetailRow label="Course" value={data.course_id} badge badgeVariant="default" />
							<DetailRow label="Module" value={data.module_id} />
							<DetailRow label="Method" value={data.instruction_method.replace("-", " ")} />
							<DetailRow label="Student ID" value={data.student_id} />
						</div>
					</div>

					<Separator />

					{/* Mood & Well-being */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg flex items-center gap-2">
							<Zap className="h-5 w-5" />
							Mood & Well-being
						</h3>
						<div className="bg-muted/50 rounded-lg p-4 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground mb-2">Before Session</p>
									<MoodIndicator mood={data.mood_before} />
								</div>
								<div>
									<p className="text-sm text-muted-foreground mb-2">After Session</p>
									<MoodIndicator mood={data.mood_after} />
								</div>
							</div>
							<ProgressBar value={data.stress_level} label="Stress Level" />
							<DetailRow
								label="Sleep Hours (Previous Night)"
								value={`${data.sleep_hours_prev_night.toFixed(1)} hours`}
								icon={<Moon className="h-4 w-4" />}
							/>
						</div>
					</div>

					<Separator />

					{/* Learning Metrics */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg flex items-center gap-2">
							<Brain className="h-5 w-5" />
							Learning Metrics
						</h3>
						<div className="bg-muted/50 rounded-lg p-4 space-y-4">
							<ProgressBar value={data.perceived_cognitive_load} label="Cognitive Load" />
							<ProgressBar value={data.task_difficulty_rating} label="Task Difficulty" />
							<div className="space-y-2">
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Comprehension Confidence</span>
									<span className="font-medium">{data.comprehension_confidence}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2.5">
									<div
										className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all"
										style={{ width: `${data.comprehension_confidence}%` }}
									/>
								</div>
							</div>
							<DetailRow label="Number of Pauses" value={data.num_pauses} />
							<DetailRow label="Distraction Events" value={data.distraction_events} />
						</div>
					</div>

					<Separator />

					{/* Quiz Performance */}
					<div className="space-y-3">
						<h3 className="font-semibold text-lg flex items-center gap-2">
							<Target className="h-5 w-5" />
							Quiz Performance
						</h3>
						<div className="bg-muted/50 rounded-lg p-4 space-y-2">
							<DetailRow
								label="Quiz Score"
								value={`${data.quiz_score}`}
								badge
								badgeVariant={data.quiz_score >= 80 ? "default" : data.quiz_score >= 60 ? "secondary" : "destructive"}
							/>
							<DetailRow label="Attempts" value={data.num_attempts_quiz} />
							<DetailRow label="Time to Complete" value={formatDuration(data.time_to_complete_quiz_seconds)} />
							<DetailRow
								label="Opened Feedback"
								value={data.opened_feedback ? "Yes" : "No"}
								icon={
									data.opened_feedback ? (
										<CheckCircle2 className="h-4 w-4 text-green-500" />
									) : (
										<XCircle className="h-4 w-4 text-red-500" />
									)
								}
							/>
							{data.time_to_open_feedback_hours && (
								<DetailRow
									label="Time to Open Feedback"
									value={`${data.time_to_open_feedback_hours.toFixed(1)} hours`}
								/>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
