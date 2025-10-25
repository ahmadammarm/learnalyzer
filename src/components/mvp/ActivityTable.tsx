"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ActivityForm from "./ActivityForm";

interface Activity {
	id: string;
	userId: string;
	date: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	activityType: string;
	subType: string | null;
	understandingLevel: number;
	notes: string | null;
	createdAt: string;
}

export default function ActivityTable() {
	const [activities, setActivities] = useState<Activity[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const response = await fetch("/api/activities");
				if (!response.ok) {
					throw new Error("Gagal mengambil data aktivitas");
				}
				const data = await response.json();
				setActivities(data.activities);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Terjadi kesalahan");
			} finally {
				setLoading(false);
			}
		};

		fetchActivities();
	}, []);

	const getUnderstandingColor = (level: number) => {
		if (level >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
		if (level >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
		if (level >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
		return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	if (error) {
		return (
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="text-destructive">Kesalahan</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">{error}</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div className="space-y-2">
					<h1 className="text-3xl lg:text-4xl font-bold text-white">Activity Notes</h1>
					<p className="text-gray-400">Manage and review your learning activities here</p>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">New Activity</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-3xl transition-all duration-300 group">
						<DialogHeader className="mb-4">
							<DialogTitle className="text-2xl font-bold">Add Study Activity</DialogTitle>
							<DialogDescription className="text-gray-400">
								Fill in the details of your study activity
							</DialogDescription>
						</DialogHeader>
						<ActivityForm />
					</DialogContent>
				</Dialog>
			</div>

			<Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl transition-all duration-300 group">
				<CardContent className="min-h-[500px]">
					{loading ? (
						<div>
							<SkeletonTable />
						</div>
					) : activities.length === 0 ? (
						<div className="flex items-center justify-center py-8">
							<p className="text-sm text-muted-foreground">Let's add your activity!</p>
						</div>
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-primary/10 hover:rounded-full">
										<TableHead className="font-semibold">Tanggal</TableHead>
										<TableHead className="font-semibold">Jenis Aktivitas</TableHead>
										<TableHead className="font-semibold">Sub Jenis</TableHead>
										<TableHead className="font-semibold">Waktu</TableHead>
										<TableHead className="font-semibold">Durasi</TableHead>
										<TableHead className="font-semibold">Tingkat Pemahaman</TableHead>
										<TableHead className="font-semibold">Catatan</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{activities.map((activity) => (
										<TableRow key={activity.id} className="hover:bg-primary/10 hover:rounded-full h-12">
											<TableCell className="font-light">{formatDate(activity.date)}</TableCell>
											<TableCell>
												<Badge variant="outline">{activity.activityType}</Badge>
											</TableCell>
											<TableCell>
												{activity.subType ? (
													<span className="text-sm text-muted-foreground">{activity.subType}</span>
												) : (
													<span className="text-xs text-muted-foreground">—</span>
												)}
											</TableCell>
											<TableCell className="text-sm">
												{activity.startTime} - {activity.endTime}
											</TableCell>
											<TableCell className="text-sm">{activity.durationMinutes} menit</TableCell>
											<TableCell>
												<Badge className={getUnderstandingColor(activity.understandingLevel)}>
													{activity.understandingLevel}%
												</Badge>
											</TableCell>
											<TableCell className="max-w-xs truncate text-sm text-muted-foreground">
												{activity.notes || "—"}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export function SkeletonTable() {
	return (
		<Table className="max-w-full mx-auto">
			<TableHeader>
				<TableRow>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
					<TableHead>
						<Skeleton className="h-4" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(5)].map((_, i) => (
					<TableRow key={i}>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-6" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
