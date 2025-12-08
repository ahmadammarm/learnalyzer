import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const session = await auth();
	const user = session?.user;

	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}

	try {
		const searchParams = request.nextUrl.searchParams;
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");
		const skip = (page - 1) * limit;

		const [data, total] = await Promise.all([
			prisma.learningFatigueMetric.findMany({
				orderBy: { date: "desc" },
				skip,
				take: limit,
			}),
			prisma.learningFatigueMetric.count(),
		]);

		return NextResponse.json(
			{
				data,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Error fetching table data:", error);
		return NextResponse.json(
			{
				message: error.message || "Internal Server Error",
			},
			{ status: 500 }
		);
	}
}
