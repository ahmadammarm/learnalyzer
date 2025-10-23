/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type ActivityFormData, ActivitySchema } from "@/schemas/ActivitySchema";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { toast } from "sonner";

export default function ActivityForm() {
    const activityTypes = ["Belajar", "Olahraga", "Membaca", "Coding", "Meeting", "Lainnya"];

    const now = new Date();
    const pad = (num: number) => String(num).padStart(2, "0");
    const startTimeDefault = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const endTimeDefault = `${pad((now.getHours() + 1) % 24)}:${pad(now.getMinutes())}`;

    const defaultValues: ActivityFormData = {
        date: new Date().toISOString().split("T")[0],
        activityType: activityTypes[0],
        subType: "",
        startTime: startTimeDefault,
        endTime: endTimeDefault,
        understandingLevel: 1,
        notes: "",
    };

    const form = useForm<ActivityFormData>({
        resolver: zodResolver(ActivitySchema),
        defaultValues,
    });

    const understandingLevels = [
        { value: 1, label: "1 - Tidak Paham" },
        { value: 2, label: "2 - Kurang Paham" },
        { value: 3, label: "3 - Cukup Paham" },
        { value: 4, label: "4 - Paham" },
        { value: 5, label: "5 - Sangat Paham" },
    ];

    const submitActivity = async (data: ActivityFormData) => {
        const cleanData: Record<string, any> = { ...data };

        Object.keys(cleanData).forEach((key) => {
            if (cleanData[key] === "" || cleanData[key] === null || cleanData[key] === undefined) {
                delete cleanData[key];
            }
        });

        const response = await fetch("/api/activities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cleanData),
        });

        const result = await response.json();
        if (!response.ok) throw result;
        return result;
    };

    const mutation = useMutation({
        mutationFn: submitActivity,
        onSuccess: () => {
            toast.success("Aktivitas berhasil ditambahkan!");
            form.reset(defaultValues);
        },
        onError: (error: any) => {
            toast.error(error.message || "Terjadi kesalahan saat menyimpan data");
        },
    });

    const onSubmit: SubmitHandler<ActivityFormData> = (data) => {
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900 rounded-lg shadow-2xl p-6 md:p-8 border border-slate-700">
                    <h1 className="text-3xl font-bold text-white mb-6">Tambah Aktivitas</h1>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">
                                            Tanggal <span className="text-red-400">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-800 text-slate-100 border border-slate-600" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="activityType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">
                                            Jenis Aktivitas <span className="text-red-400">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 text-slate-100 border border-slate-600 w-full">
                                                    <SelectValue placeholder="Pilih jenis aktivitas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border border-slate-600">
                                                {activityTypes.map((type) => (
                                                    <SelectItem key={type} value={type} className="text-slate-100">
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="subType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Sub Tipe</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Contoh: JavaScript, Kardio, Novel"
                                                className="bg-slate-800 text-slate-100 border border-slate-600"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200">
                                                Waktu Mulai <span className="text-red-400">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    {...field}
                                                    value={field.value || startTimeDefault}
                                                    className="bg-slate-800 text-slate-100 border border-slate-600"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-200">
                                                Waktu Selesai <span className="text-red-400">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    {...field}
                                                    value={field.value || endTimeDefault}
                                                    className="bg-slate-800 text-slate-100 border border-slate-600"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="understandingLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Tingkat Pemahaman <span className="text-red-400">*</span></FormLabel>
                                        <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 text-slate-100 border border-slate-600 w-full">
                                                    <SelectValue placeholder="Pilih tingkat pemahaman" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border border-slate-600">
                                                {understandingLevels.map((level) => (
                                                    <SelectItem key={level.value} value={String(level.value)} className="text-slate-100">
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-200">Catatan</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={4}
                                                maxLength={500}
                                                placeholder="Tambahkan catatan tentang aktivitas ini..."
                                                className="bg-slate-800 text-slate-100 border border-slate-600 resize-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Aktivitas"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
