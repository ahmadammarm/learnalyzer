/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function GET(request: NextRequest) {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const totalHours = await prisma.activity.aggregate({
            where: { userId: user.id },
            _sum: { durationMinutes: true },
        });

        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const totalHoursThisWeek = await prisma.activity.aggregate({
            where: {
                userId: user.id,
                createdAt: { gte: oneWeekAgo },
            },
            _sum: { durationMinutes: true },
        });

        const totalHoursLastWeek = await prisma.activity.aggregate({
            where: {
                userId: user.id,
                createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
            },
            _sum: { durationMinutes: true },
        });

        const averageUnderstanding = await prisma.activity.aggregate({
            where: { userId: user.id },
            _avg: { understandingLevel: true },
        });

        const averageUnderstandingThisWeek = await prisma.activity.aggregate({
            where: {
                userId: user.id,
                createdAt: { gte: oneWeekAgo },
            },
            _avg: { understandingLevel: true },
        });

        const averageUnderstandingLastWeek = await prisma.activity.aggregate({
            where: {
                userId: user.id,
                createdAt: { gte: twoWeeksAgo, lt: oneWeekAgo },
            },
            _avg: { understandingLevel: true },
        });

        const mostCommonActivity = await prisma.activity.groupBy({
            by: ["activityType"],
            where: { userId: user.id },
            _count: { activityType: true },
        });

        const hoursThisWeek = (totalHoursThisWeek._sum.durationMinutes || 0) / 60;
        const hoursLastWeek = (totalHoursLastWeek._sum.durationMinutes || 0) / 60;
        const weeklyChangeHours = hoursThisWeek - hoursLastWeek;

        const understandingThisWeek = averageUnderstandingThisWeek._avg.understandingLevel || 0;
        const understandingLastWeek = averageUnderstandingLastWeek._avg.understandingLevel || 0;
        const weeklyChangeUnderstanding = understandingThisWeek - understandingLastWeek;

        return NextResponse.json(
            {
                totalHours: Math.round((totalHours._sum.durationMinutes || 0) / 60),
                totalHoursInAWeek: Math.round(hoursThisWeek),
                averageUnderstanding: (averageUnderstanding._avg.understandingLevel || 0).toFixed(2),
                mostCommonActivity:
                    mostCommonActivity.sort((a, b) => b._count.activityType - a._count.activityType)[0]
                        ?.activityType || null,
                weeklyChangeHours: Math.round(weeklyChangeHours),
                weeklyChangeUnderstanding: Math.round(weeklyChangeUnderstanding),
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server error", status: 500 },
            { status: 500 }
        );
    }
}
