"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "../ui/button"

interface Activity {
    id: string
    userId: string
    date: string
    startTime: string
    endTime: string
    durationMinutes: number
    activityType: string
    subType: string | null
    understandingLevel: number
    notes: string | null
    createdAt: string
}

export default function ActivityTable() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch("/api/activities")
                if (!response.ok) {
                    throw new Error("Gagal mengambil data aktivitas")
                }
                const data = await response.json()
                setActivities(data.activities)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan")
            } finally {
                setLoading(false)
            }
        }

        fetchActivities()
    }, [])

    const getUnderstandingColor = (level: number) => {
        if (level >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        if (level >= 60) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        if (level >= 40) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
    }

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
        )
    }

    const handleAddActivity = () => {
        window.open("/dashboard/activities/form", "_blank");
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Catatan Aktivitas</CardTitle>
                <CardDescription>
                    {activities.length} {activities.length === 1 ? "aktivitas tercatat" : "aktivitas tercatat"}
                </CardDescription>
                <div className="flex justify-end mb-4">
                    <Button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAddActivity}
                    >
                        Tambah Aktivitas
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">Belum ada aktivitas yang tercatat</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Jenis Aktivitas</TableHead>
                                    <TableHead>Sub Jenis</TableHead>
                                    <TableHead>Waktu</TableHead>
                                    <TableHead>Durasi</TableHead>
                                    <TableHead>Tingkat Pemahaman</TableHead>
                                    <TableHead>Catatan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activities.map((activity) => (
                                    <TableRow key={activity.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">{formatDate(activity.date)}</TableCell>
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
    )
}