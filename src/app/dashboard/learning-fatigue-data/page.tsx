"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LearningDetails from "@/components/mvp/LearningDetails";

export const QUERY_KEYS = {
	learnings: ["learnings"] as const,
	learningsTable: (page: number, limit: number) => ["learnings-table", page, limit] as const,
};

export interface LearningFatigueData {
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

export interface PaginationInfo {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export interface TableResponse {
	data: LearningFatigueData[];
	pagination: PaginationInfo;
}

export async function fetchDataTable(page: number = 1, limit: number = 10): Promise<TableResponse> {
	const response = await fetch(`/api/table?page=${page}&limit=${limit}`, {
		credentials: "include",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch learning fatigue data");
	}

	return response.json();
}

const formatDate = (date: string): string => {
	return new Date(date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "short",
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

function TableHeaderSkeleton() {
	return (
		<TableRow>
			{Array.from({ length: 8 }).map((_, i) => (
				<TableHead key={i}>
					<Skeleton className="h-8 w-full" />
				</TableHead>
			))}
		</TableRow>
	);
}

function TableRowSkeleton() {
	return (
		<TableRow>
			{Array.from({ length: 8 }).map((_, i) => (
				<TableCell key={i}>
					<Skeleton className="h-6 w-full" />
				</TableCell>
			))}
		</TableRow>
	);
}

function SkeletonTable() {
	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableHeaderSkeleton />
				</TableHeader>
				<TableBody>
					{Array.from({ length: 10 }).map((_, i) => (
						<TableRowSkeleton key={i} />
					))}
				</TableBody>
			</Table>
		</div>
	);
}

interface ErrorStateProps {
	error: Error;
	onRetry?: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
	return (
		<Card className="border-destructive">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-destructive">
					<AlertCircle className="h-5 w-5" />
					Error Loading Learning Fatigue Data
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground">{error.message}</p>
				{onRetry && (
					<Button onClick={onRetry} variant="outline" size="sm">
						Try Again
					</Button>
				)}
			</CardContent>
		</Card>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center py-12 space-y-4">
			<div className="text-6xl">📚</div>
			<p className="text-lg font-medium">No Learning Fatigue Data yet</p>
		</div>
	);
}

interface Props {
	fatigueData: LearningFatigueData;
}

function FatigueDataRow({ fatigueData }: Props) {
	const getMoodColor = (mood: string) => {
		const moods: Record<string, string> = {
			happy: "text-green-500",
			neutral: "text-white",
			tired: "text-yellow-500",
			stressed: "text-red-500",
		};
		return moods[mood.toLowerCase()] || "text-white";
	};

	return (
		<TableRow className="hover:bg-primary/5">
			<TableCell className="font-medium">{formatDate(fatigueData.date)}</TableCell>
			<TableCell>{formatTime(fatigueData.start_time)}</TableCell>
			<TableCell>
				<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
					{fatigueData.course_id}
				</span>
			</TableCell>
			<TableCell className="capitalize">{fatigueData.instruction_method.replace("-", " ")}</TableCell>
			<TableCell>{fatigueData.duration_minutes} min</TableCell>
			<TableCell>
				<div className="flex items-center gap-1 font-semibold">
					<span className={getMoodColor(fatigueData.mood_before)}>{fatigueData.mood_before}</span>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-1 font-semibold">
					<span className={getMoodColor(fatigueData.mood_after)}>{fatigueData.mood_after}</span>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					<div className="w-full max-w-[80px] bg-gray-200 rounded-full h-2">
						<div
							className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
							style={{ width: `${fatigueData.comprehension_confidence}%` }}
						/>
					</div>
					<span className="text-sm font-medium">{fatigueData.comprehension_confidence}%</span>
				</div>
			</TableCell>
			<TableCell>
				<span
					className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
						fatigueData.quiz_score >= 80
							? "bg-green-100 text-green-800"
							: fatigueData.quiz_score >= 60
							? "bg-yellow-100 text-yellow-800"
							: "bg-red-100 text-red-800"
					}`}
				>
					{fatigueData.quiz_score}
				</span>
			</TableCell>
			<TableCell>
				<LearningDetails data={fatigueData} />
			</TableCell>
		</TableRow>
	);
}

export default function Page() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading, isError, error } = useQuery({
		queryKey: QUERY_KEYS.learningsTable(page, limit),
		queryFn: () => fetchDataTable(page, limit),
		staleTime: 30000,
		retry: 2,
		placeholderData: (previousData) => previousData,
	});

	const handleRefresh = () => {
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.learningsTable(page, limit),
		});
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		// Prefetch next and previous pages
		if (data?.pagination) {
			if (newPage < data.pagination.totalPages) {
				queryClient.prefetchQuery({
					queryKey: QUERY_KEYS.learningsTable(newPage + 1, limit),
					queryFn: () => fetchDataTable(newPage + 1, limit),
				});
			}
			if (newPage > 1) {
				queryClient.prefetchQuery({
					queryKey: QUERY_KEYS.learningsTable(newPage - 1, limit),
					queryFn: () => fetchDataTable(newPage - 1, limit),
				});
			}
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl lg:text-4xl font-bold text-white">Learning Fatigue Data</h1>
					<p className="text-gray-400">
						{data?.pagination?.total
							? `${data.pagination.total} total learnings recorded`
							: "Manage and review Learning Fatigue Data here"}
					</p>
				</div>
				<div className="flex gap-2">
					<Button onClick={handleRefresh} variant="default" disabled={isLoading} className="rounded-full">
						<RefreshCcw className="w-5 h-5" /> Refresh
					</Button>
					<Link href="/dashboard">
						<Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">Go to Analytics</Button>
					</Link>
				</div>
			</div>

			<Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl transition-all duration-300">
				<CardContent className="min-h-[500px] flex flex-col">
					{isError ? (
						<ErrorState error={error as Error} onRetry={handleRefresh} />
					) : isLoading && !data ? (
						<SkeletonTable />
					) : !data?.data?.length ? (
						<EmptyState />
					) : (
						<>
							<div className="overflow-x-auto flex-1">
								<Table>
									<TableHeader>
										<TableRow className="hover:bg-primary/10 text-lg">
											<TableHead className="font-semibold">Tanggal</TableHead>
											<TableHead className="font-semibold">Waktu</TableHead>
											<TableHead className="font-semibold">Course</TableHead>
											<TableHead className="font-semibold">Metode</TableHead>
											<TableHead className="font-semibold">Durasi</TableHead>
											<TableHead className="font-semibold">Mood Before</TableHead>
											<TableHead className="font-semibold">Mood After</TableHead>
											<TableHead className="font-semibold">Confidence</TableHead>
											<TableHead className="font-semibold">Quiz Score</TableHead>
											<TableHead className="font-semibold">Details</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{data.data.map((fatigueData) => (
											<FatigueDataRow key={fatigueData.id} fatigueData={fatigueData} />
										))}
									</TableBody>
								</Table>
							</div>

							{data.pagination && data.pagination.totalPages > 1 && (
								<div className="mt-4 pt-4 border-t border-white/10">
									<Pagination
										currentPage={page}
										totalPages={data.pagination.totalPages}
										onPageChange={handlePageChange}
										isLoading={isLoading}
									/>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
