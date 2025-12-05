/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { BookOpen, AlertTriangle, Brain, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from "recharts";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react";

const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return {
        short: `${months[d.getMonth()]} ${d.getDate()}`,
        long: `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
        time: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
    };
};

export default function FatigueDashboardPage() {
    const { data: session } = useSession();

    const fatigueQuery = useQuery({
        queryKey: ["fatigue-dashboard"],
        queryFn: async () => {
            const response = await fetch("/api/fatigue-dashboard");
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
    const avgFatigueValue = data?.avgFatiguePerCourse?.length > 0
        ? (data.avgFatiguePerCourse.reduce((sum: any, item: { _avg: { stress_level: any; }; }) => sum + (item._avg.stress_level || 0), 0) / data.avgFatiguePerCourse.length).toFixed(1)
        : 0;

    const weeklyTrendData = data?.weeklyTrend?.map((item: { date: any; avgfatigue: string; }) => ({
        date: formatDate(item.date).short,
        fatigue: parseFloat(item.avgfatigue).toFixed(1)
    })) || [];

    const cognitiveLoadData = data?.cognitiveLoadDistribution?.map((item: { perceived_cognitive_load: any; _count: { perceived_cognitive_load: any; }; }) => ({
        load: `Load ${item.perceived_cognitive_load}`,
        count: item._count.perceived_cognitive_load
    })) || [];

    const lowAttentionData = data?.lowAttentionCourses?.map((item: { course_id: any; _avg: { quiz_score: any; }; }) => ({
        course: `Course ${item.course_id}`,
        score: item._avg.quiz_score
    })) || [];

    const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

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
                            Average fatigue level: <span className="font-semibold text-primary">{avgFatigueValue}/10</span> - Monitor your learning wellness
                        </p>
                    )}
                    <p className="text-sm text-gray-500">{formatDate(new Date()).long}</p>
                </div>
                <Link href="/dashboard/session/new">
                    <Button className="bg-white hover:bg-purple-100 text-black rounded-full px-6">
                        New Learning Session
                    </Button>
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
                            title="Cognitive Load"
                            value={cognitiveLoadData[0]?.load?.replace('Load ', '') || "N/A"}
                            subValue=""
                            change="Most common"
                            trend="up"
                            icon={Brain}
                            gradient="from-green-500 to-emerald-500"
                        />
                    </>
                )}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Fatigue Trend */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Weekly Fatigue Trend</h3>
                    {fatigueQuery.isPending ? (
                        <Skeleton className="h-64 w-full rounded-md" />
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={weeklyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }}
                                />
                                <Line type="monotone" dataKey="fatigue" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Cognitive Load Distribution */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Cognitive Load Distribution</h3>
                    {fatigueQuery.isPending ? (
                        <Skeleton className="h-64 w-full rounded-md" />
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={cognitiveLoadData}
                                    dataKey="count"
                                    nameKey="load"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={(entry) => `${entry.load}: ${entry.count}`}
                                >
                                    {cognitiveLoadData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Low Attention Courses */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Courses Needing Attention</h3>
                    {fatigueQuery.isPending ? (
                        <Skeleton className="h-64 w-full rounded-md" />
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={lowAttentionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="course" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }}
                                />
                                <Bar dataKey="score" fill="#ec4899" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Duration vs Fatigue Correlation */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Duration vs Fatigue</h3>
                    {fatigueQuery.isPending ? (
                        <Skeleton className="h-64 w-full rounded-md" />
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="sessionduration" name="Duration (min)" stroke="#9ca3af" />
                                <YAxis dataKey="fatiguelevel" name="Fatigue" stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }}
                                    cursor={{ strokeDasharray: '3 3' }}
                                />
                                <Scatter name="Sessions" data={data?.correlationData || []} fill="#10b981" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Recent High Fatigue Alerts */}
            {!fatigueQuery.isPending && data?.anomalies?.length > 0 && (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="text-orange-500" />
                        Recent High Fatigue Sessions
                    </h3>
                    <div className="space-y-3">
                        {data.anomalies.slice(0, 5).map((anomaly: { course_id: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; created_at: any; stress_level: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: Key | null | undefined) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-orange-500/20">
                                <div>
                                    <p className="text-white font-medium">Course ID: {anomaly.course_id}</p>
                                    <p className="text-sm text-gray-400">
                                        {formatDate(anomaly.created_at).time}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-orange-500">{anomaly.stress_level}/10</p>
                                    <p className="text-xs text-gray-400">Stress Level</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}