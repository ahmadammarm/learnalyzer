"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import ActivityForm from "./ActivityForm";
import { AlertCircle } from "lucide-react";

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

interface ActivitiesResponse {
    activities: Activity[];
}

const QUERY_KEYS = {
    activities: ["activities"] as const,
};

const UNDERSTANDING_LEVELS = {
    pahamSekali: { min: 5, className: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200" },
    paham: { min: 4, className: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200" },
    cukupPaham: { min: 3, className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200" },
    kurangPaham: { min: 2, className: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200" },
    tidakPaham: { min: 1, className: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" },
};

const fetchActivities = async (): Promise<ActivitiesResponse> => {
    const response = await fetch("/api/activities");

    if (!response.ok) {
        throw new Error("Failed to fetch activities");
    }

    return response.json();
};

const getUnderstandingColor = (level: number): string => {
    if (level >= UNDERSTANDING_LEVELS.pahamSekali.min) return UNDERSTANDING_LEVELS.pahamSekali.className;
    if (level >= UNDERSTANDING_LEVELS.paham.min) return UNDERSTANDING_LEVELS.paham.className;
    if (level >= UNDERSTANDING_LEVELS.cukupPaham.min) return UNDERSTANDING_LEVELS.cukupPaham.className;
    return UNDERSTANDING_LEVELS.kurangPaham.className;
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

function TableHeaderSkeleton() {
    return (
        <TableRow>
            {Array.from({ length: 7 }).map((_, i) => (
                <TableHead key={i}>
                    <Skeleton className="h-4 w-full" />
                </TableHead>
            ))}
        </TableRow>
    );
}

function TableRowSkeleton() {
    return (
        <TableRow>
            {Array.from({ length: 7 }).map((_, i) => (
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
                    {Array.from({ length: 5 }).map((_, i) => (
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
                    Error Loading Activities
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
            <p className="text-lg font-medium">No activities yet</p>
            <p className="text-sm text-muted-foreground">Let&apos;s add your first activity!</p>
        </div>
    );
}

interface ActivityRowProps {
    activity: Activity;
}

function ActivityRow({ activity }: ActivityRowProps) {
    return (
        <TableRow className="hover:bg-primary/10 transition-colors">
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
                    {activity.understandingLevel === 1 && "Tidak paham"}
                    {activity.understandingLevel === 2 && "Kurang paham"}
                    {activity.understandingLevel === 3 && "Cukup paham"}
                    {activity.understandingLevel === 4 && "Paham"}
                    {activity.understandingLevel === 5 && "Paham sekali"}
                </Badge>
            </TableCell>
            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                {activity.notes || "—"}
            </TableCell>
        </TableRow>
    );
}

export default function ActivityTable() {
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: QUERY_KEYS.activities,
        queryFn: fetchActivities,
        staleTime: 30000,
        retry: 2,
    });

    const activities = useMemo(() => data?.activities ?? [], [data]);

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.activities });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-white">Activity Notes</h1>
                    <p className="text-gray-400">Manage and review your learning activities here</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">
                            New Activity
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-1/2 bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-3xl transition-all duration-300">
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

            <Card className="bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl transition-all duration-300">
                <CardContent className="min-h-[500px] p-6">
                    {isError ? (
                        <ErrorState error={error as Error} onRetry={handleRefresh} />
                    ) : isLoading ? (
                        <SkeletonTable />
                    ) : activities.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-primary/10">
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
                                        <ActivityRow key={activity.id} activity={activity} />
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

export { SkeletonTable };