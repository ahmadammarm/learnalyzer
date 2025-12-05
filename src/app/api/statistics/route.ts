import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1. Rata-rata fatigue per course
        const avgFatiguePerCourse = await prisma.learningFatigueMetric.groupBy({
            by: ["course_id"],
            _avg: { stress_level: true },
        });

        // 2. Trend fatigue mingguan (7 hari terakhir)
        const weeklyTrend = await prisma.$queryRaw`
            SELECT 
                DATE("date") AS date,
                AVG(stress_level) AS "avgFatigue"
            FROM "LearningFatigueMetric"
            WHERE "date" IS NOT NULL
                AND "date" >= NOW() - INTERVAL '7 days'
            GROUP BY DATE("date")
            ORDER BY date ASC;
        `;

        // 3. Distribusi cognitive load
        const cognitiveLoadDistribution = await prisma.learningFatigueMetric.groupBy({
            by: ["perceived_cognitive_load"],
            _count: { perceived_cognitive_load: true },
        });

        // 4. Course dengan attention terendah (quiz_score terendah)
        const lowAttentionCourses = await prisma.learningFatigueMetric.groupBy({
            by: ["course_id"],
            _avg: { quiz_score: true },
            orderBy: {
                _avg: { quiz_score: "asc" }
            },
            take: 5
        });

        // 5. Data durasi vs fatigue untuk korelasi
        const correlationData = await prisma.$queryRaw`
            SELECT 
                duration_minutes, 
                stress_level
            FROM "LearningFatigueMetric"
            WHERE duration_minutes IS NOT NULL 
              AND stress_level IS NOT NULL
            ORDER BY "created_at" DESC
            LIMIT 300;
        `;

        // 6. Deteksi anomali fatigue (stress_level >= 9)
        const anomalies = await prisma.learningFatigueMetric.findMany({
            where: { stress_level: { gte: 9 } },
            orderBy: { created_at: "desc" },
            take: 20,
        });

        return NextResponse.json({
            avgFatiguePerCourse,
            weeklyTrend,
            cognitiveLoadDistribution,
            lowAttentionCourses,
            correlationData,
            anomalies,
        });
    } catch (error) {
        console.error("[DASHBOARD_ERROR]", error);
        return NextResponse.json(
            { error: "Failed to load dashboard data" },
            { status: 500 }
        );
    }
}
