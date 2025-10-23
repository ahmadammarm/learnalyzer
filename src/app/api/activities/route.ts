/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ActivitySchema } from "@/schemas/ActivitySchema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {

        const data = await request.json();

        const parseResulst = ActivitySchema.safeParse(data);

        if (!parseResulst.success) {
            const errors = parseResulst.error.flatten().fieldErrors;
            return NextResponse.json({ message: "Validation Error", errors }, { status: 400 });
        }

        const activityData = parseResulst.data;


        const startDateTime = new Date(`${activityData.date}T${activityData.startTime}`);
        const endDateTime = new Date(`${activityData.date}T${activityData.endTime}`);
        const calculatedDuration = Math.round((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));

        const newActivity = await prisma.activity.create({
            data: {
                userId: user.id,
                date: new Date(activityData.date),
                startTime: activityData.startTime || "",
                endTime: activityData.endTime || "",
                durationMinutes: calculatedDuration,
                activityType: activityData.activityType,
                subType: activityData.subType || "",
                understandingLevel: activityData.understandingLevel,
                notes: activityData.notes || "",
            },
        });

        return NextResponse.json({ message: "Activity created successfully", activity: newActivity }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}


export async function GET(request: NextRequest) {

    const session = await auth();
    const user = session?.user;

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const activities = await prisma.activity.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' },
        });

        return NextResponse.json({ activities }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}