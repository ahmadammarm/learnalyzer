/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
	BookOpen,
	Calendar as CalendarIcon,
	Clock,
	FileText,
	Lightbulb,
	Loader2,
	Tag,
	ChevronDown,
} from "lucide-react";
import { type ActivityFormData, ActivitySchema } from "@/schemas/ActivitySchema";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Slider } from "../ui/slider";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ActivityForm() {
	const [duration, setDuration] = useState("0h 0m");
	const [datePickerOpen, setDatePickerOpen] = useState(false);

	const activityTypes = [
		"Reading",
		"Practice Problems",
		"Lecture/Video",
		"Group Study",
		"Project Work",
		"Review",
		"Other",
	];

	const now = new Date();
	const pad = (num: number) => String(num).padStart(2, "0");
	const startTimeDefault = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
	const endTimeDefault = `${pad((now.getHours() + 1) % 24)}:${pad(now.getMinutes())}`;

	const defaultValues: ActivityFormData = {
		date: new Date().toISOString().split("T")[0],
		activityType: "",
		subType: "",
		startTime: startTimeDefault,
		endTime: endTimeDefault,
		understandingLevel: 3,
		notes: "",
	};

	const form = useForm<ActivityFormData>({
		resolver: zodResolver(ActivitySchema),
		defaultValues,
	});

	const calculateDuration = (start: string, end: string) => {
		if (!start || !end) return;

		const [startHour, startMin] = start.split(":").map(Number);
		const [endHour, endMin] = end.split(":").map(Number);

		const startTotalMin = startHour * 60 + startMin;
		let endTotalMin = endHour * 60 + endMin;

		if (endTotalMin < startTotalMin) {
			endTotalMin += 24 * 60;
		}

		const diffMin = endTotalMin - startTotalMin;
		const hours = Math.floor(diffMin / 60);
		const minutes = diffMin % 60;

		setDuration(`${hours}h ${minutes}m`);
	};

	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "startTime" || name === "endTime") {
				calculateDuration(value.startTime || "", value.endTime || "");
			}
		});
		return () => subscription.unsubscribe();
	}, [form]);

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
			toast.success("Activity added successfully!");
			form.reset(defaultValues);
			setDuration("0h 0m");
			window.location.reload();
		},
		onError: (error: any) => {
			toast.error(error.message || "An error occurred while saving data");
		},
	});

	const onSubmit: SubmitHandler<ActivityFormData> = (data) => {
		mutation.mutate(data);
	};

	const currentLevel = form.watch("understandingLevel");
	const getLevelColor = (level: number) => {
		const colors = ["text-red-600", "text-orange-600", "text-yellow-600", "text-green-600", "text-blue-600"];
		return colors[level - 1] || "from-gray-500 to-gray-600";
	};

	return (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Date Field with Date Picker */}
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel className="flex items-center gap-2 text-gray-200 mb-2">
									<CalendarIcon className="w-4 h-4 text-purple-400" />
									Date <span className="text-red-400">*</span>
								</FormLabel>
								<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"default"}
												className={cn(
													"w-full rounded-full justify-between !bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 h-11",
													!field.value && "border-purple-500/50 ring-purple-500/50"
												)}
											>
												{field.value ? format(new Date(field.value), "PPP") : "Select date"}
												<ChevronDown className="w-4 h-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0 bg-gray-900 border-white/10 rounded-xl" align="start">
										<Calendar
											mode="single"
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={(date) => {
												if (date) {
													field.onChange(format(date, "yyyy-MM-dd"));
													setDatePickerOpen(false);
												}
											}}
											disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
											initialFocus
											className="bg-gray-900 text-white rounded-md"
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Time Fields */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="startTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="flex items-center gap-2 text-gray-200">
										<Clock className="w-4 h-4 text-purple-400" />
										Start Time <span className="text-red-400">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="time"
											{...field}
											value={field.value || startTimeDefault}
											className="rounded-full !bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 h-11"
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
									<FormLabel className="flex items-center gap-2 text-gray-200">
										<Clock className="w-4 h-4 text-purple-400" />
										End Time <span className="text-red-400">*</span>
									</FormLabel>
									<FormControl>
										<Input
											type="time"
											{...field}
											value={field.value || endTimeDefault}
											className="rounded-full !bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 h-11"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Duration Display */}
					<div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl backdrop-blur-sm">
						<p className="text-sm text-gray-400 mb-1">Duration</p>
						<p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
							{duration}
						</p>
					</div>

					{/* Activity Type */}
					<FormField
						control={form.control}
						name="activityType"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2 text-gray-200">
									<BookOpen className="w-4 h-4 text-purple-400" />
									Activity Type <span className="text-red-400">*</span>
								</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger className="w-full rounded-full !bg-white/5 border-white/10 text-white focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 py-5.5">
											<SelectValue placeholder="Select activity type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent className="bg-gray-900 border-white/10 backdrop-blur-md">
										{activityTypes.map((type) => (
											<SelectItem
												key={type}
												value={type}
												className="text-gray-200 focus:bg-purple-500/20 focus:text-white py-2"
											>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Sub Type */}
					<FormField
						control={form.control}
						name="subType"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2 text-gray-200">
									<Tag className="w-4 h-4 text-purple-400" />
									Sub Type / Topic
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="e.g., JavaScript Arrays, Calculus Chapter 5"
										className="rounded-full !bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 h-11"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

                    <FormField
                        control={form.control}
                        name="understandingLevel"
                        render={({ field }) => {
                            const levelLabels = ["Tidak paham", "Kurang paham", "Cukup paham", "Paham", "Paham sekali"];
                            const idx = Math.max(0, Math.min(4, (currentLevel ?? field.value ?? 3) - 1));
                            const label = levelLabels[idx];

                            return (
                                <FormItem>
                                    <FormLabel className="flex items-center gap-2 text-gray-200 mb-4">
                                        <Lightbulb className="w-4 h-4 text-purple-400" />
                                        Understanding Level <span className="text-red-400">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <Slider
                                                min={1}
                                                max={5}
                                                step={1}
                                                value={[field.value ?? 3]}
                                                onValueChange={(vals) => field.onChange(vals[0])}
                                                className="w-full"
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-400">Tidak paham</span>
                                                <div className={`px-4 py-2 rounded-lg ${getLevelColor(currentLevel ?? field.value ?? 3)}`}>
                                                    <span className="text-base font-semibold">{label}</span>
                                                </div>
                                                <span className="text-xs text-gray-400">Paham sekali</span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

					{/* Notes */}
					<FormField
						control={form.control}
						name="notes"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="flex items-center gap-2 text-gray-200">
									<FileText className="w-4 h-4 text-purple-400" />
									Notes
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										rows={4}
										maxLength={500}
										placeholder="Add any notes about your study session..."
										className="rounded-xl !bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500/50 focus:ring-purple-500/50 transition-all duration-200 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 resize-none"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={mutation.isPending}
						className="w-full bg-white hover:bg-purple-100 text-black font-semibold py-3 h-12 rounded-full transition-all duration-200"
					>
						{mutation.isPending ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin mr-2" /> Saving...
							</>
						) : (
							"Save Study Activity"
						)}
					</Button>
				</form>
			</Form>
		</>
	);
}
