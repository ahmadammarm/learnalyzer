import z from "zod";

export const ActivitySchema = z.object({
    date: z
        .string()
        .min(1, "Tanggal wajib diisi")
        .refine((date) => !isNaN(Date.parse(date)), { message: "Format tanggal tidak valid" }),

    startTime: z
        .string()
        .min(1, "Waktu mulai wajib diisi")
        .refine((val) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(val), {
            message: "Format waktu mulai tidak valid",
        }),

    endTime: z
        .string()
        .min(1, "Waktu selesai wajib diisi")
        .refine((val) => /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(val), {
            message: "Format waktu selesai tidak valid",
        }),

    activityType: z.string().min(1, "Jenis aktivitas wajib diisi"),

    subType: z.string().optional(),

    understandingLevel: z.number().min(1).max(5),

    notes: z.string().optional(),
});

export type ActivityFormData = z.infer<typeof ActivitySchema>;
