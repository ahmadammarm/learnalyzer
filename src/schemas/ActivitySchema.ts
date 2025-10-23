import z from "zod";


export const ActivitySchema = z.object({
    date: z
        .string()
        .min(1, "Tanggal wajib diisi")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Format tanggal tidak valid",
        }),

    startTime: z
        .string()
        .nullable()
        .optional()
        .refine(
            (val) => !val || /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(val),
            { message: "Format waktu mulai tidak valid" }
        ),

    endTime: z
        .string()
        .nullable()
        .optional()
        .refine(
            (val) => !val || /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(val),
            { message: "Format waktu selesai tidak valid" }
        ),

    activityType: z.string().min(1, "Jenis aktivitas wajib diisi"),

    subType: z.string().nullable().optional(),
    
    understandingLevel: z.number().min(1, "Tingkat pemahaman wajib diisi").max(5, "Tingkat pemahaman maksimal adalah 5"),

    notes: z.string().nullable().optional()

});

export type ActivityFormData = z.infer<typeof ActivitySchema>;
