/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { type ActivityFormData, ActivitySchema } from "@/schemas/ActivitySchema"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"

export default function ActivityForm() {
    const [success, setSuccess] = useState(false)
    const queryClient = useQueryClient()

    const form = useForm<ActivityFormData>({
        resolver: zodResolver(ActivitySchema),
    })

    const activityTypes = ["Belajar", "Olahraga", "Membaca", "Coding", "Meeting", "Lainnya"]

    const understandingLevels = [
        { value: 1, label: "1 - Tidak Paham" },
        { value: 2, label: "2 - Kurang Paham" },
        { value: 3, label: "3 - Cukup Paham" },
        { value: 4, label: "4 - Paham" },
        { value: 5, label: "5 - Sangat Paham" },
    ]

    const submitActivity = async (data: ActivityFormData) => {
        const submitData: Record<string, any> = { ...data }

        Object.keys(submitData).forEach((k) => {
            if (submitData[k] === undefined || submitData[k] === null || submitData[k] === "") {
                delete submitData[k]
            }
        })

        const response = await fetch("/api/activities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submitData),
        })

        const result = await response.json()
        if (!response.ok) throw result
        return result
    }

    const mutation = useMutation({
        mutationFn: submitActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activities"] })
            setSuccess(true)
            form.reset()
            setTimeout(() => setSuccess(false), 3000)
        },
        onError: (error: any) => {
            if (error?.errors) {
                Object.entries(error.errors).forEach(([field, messages]) => {
                    form.setError(field as keyof ActivityFormData, {
                        type: "server",
                        message: Array.isArray(messages) ? messages.join(", ") : String(messages),
                    })
                })
            }
        },
    })

    const onSubmit: SubmitHandler<ActivityFormData> = (data) => {
        mutation.mutate(data)
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-slate-900 rounded-lg shadow-2xl p-6 md:p-8 border border-slate-700">
                    <h1 className="text-3xl font-bold text-white mb-6">Tambah Aktivitas</h1>

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-950 border border-emerald-700 rounded-lg flex items-center gap-2 text-emerald-300">
                            <CheckCircle2 className="w-5 h-5" />
                            <p>Aktivitas berhasil ditambahkan!</p>
                        </div>
                    )}

                    {mutation.isError && (
                        <div className="mb-6 p-4 bg-red-950 border border-red-700 rounded-lg flex items-center gap-2 text-red-300">
                            <AlertCircle className="w-5 h-5" />
                            <p>
                                {(mutation.error as any)?.error ||
                                    (mutation.error as any)?.message ||
                                    "Terjadi kesalahan saat menyimpan data"}
                            </p>
                        </div>
                    )}

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
                                            <Input
                                                type="date"
                                                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-800 placeholder-slate-500"
                                                {...field}
                                            />
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
                                                <SelectTrigger className="w-full bg-slate-800 text-slate-100 border border-slate-600 focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Pilih jenis aktivitas" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border border-slate-600">
                                                {activityTypes.map((type) => (
                                                    <SelectItem key={type} value={type} className="text-slate-100 focus:bg-slate-700">
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
                                        <FormLabel className="text-slate-200">
                                            Sub Tipe <span className="text-red-400">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Contoh: JavaScript, Kardio, Novel"
                                                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-800 placeholder-slate-500"
                                                {...field}
                                                value={field.value || ""}
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
                                                    className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-800 placeholder-slate-500"
                                                    {...field}
                                                    value={field.value || ""}
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
                                                    className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-100 bg-slate-800 placeholder-slate-500"
                                                    {...field}
                                                    value={field.value || ""}
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
                                        <FormLabel className="text-slate-200">
                                            Tingkat Pemahaman (1-5) <span className="text-red-400">*</span>
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                            value={field.value?.toString()}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full bg-slate-800 text-slate-100 border border-slate-600 focus:ring-2 focus:ring-blue-500">
                                                    <SelectValue placeholder="Pilih tingkat pemahaman" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border border-slate-600">
                                                {understandingLevels.map((level) => (
                                                    <SelectItem
                                                        key={level.value}
                                                        value={level.value.toString()}
                                                        className="text-slate-100 focus:bg-slate-700"
                                                    >
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
                                        <FormLabel className="text-slate-200">
                                            Catatan <span className="text-red-400">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={4}
                                                placeholder="Tambahkan catatan tentang aktivitas ini... (maks 500 karakter)"
                                                className="w-full px-4 py-2 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-slate-100 bg-slate-800 placeholder-slate-500"
                                                maxLength={500}
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                            >
                                {mutation.isPending ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
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
    )
}
