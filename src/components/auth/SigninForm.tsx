/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SigninSchema, SigninSchemaType } from "@/schemas/SigninSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import ShinyText from "../animation/ShinyText";

export default function SigninForm() {
	const user = useSession().data?.user;
	const router = useRouter();
	const [rememberMe, setRememberMe] = useState(false);

	useEffect(() => {
		if (user) {
			router.push("/dashboard");
		}
	}, [user, router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SigninSchemaType>({
		resolver: zodResolver(SigninSchema),
	});

	const mutation = useMutation({
		mutationFn: async ({ data }: { data: SigninSchemaType }) => {
			const result = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (result?.error) {
				throw new Error(result.error);
			}

			return result;
		},
		onSuccess: () => {
			toast.success("Signed in successfully!");
			router.push("/dashboard");
		},
		onError: (error: Error) => {
			toast.error(`Sign in failed: ${error.message}`);
		},
	});

	const onSubmit = (data: SigninSchemaType) => {
		mutation.mutate({ data });
	};

	return (
		<div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
			{/* Left Side - 3D Branding Section */}
			<div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-black">
				{/* Ambient background elements */}
				<div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-500/10 to-transparent"></div>
				<div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-3xl opacity-20 animate-pulse"></div>
				<div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500 to-transparent rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>

				{/* 3D Card Container */}
				<div className="relative z-10 w-full max-w-lg">
					{/* 3D Card with rounded corners */}
					<div
						className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20"
						style={{
							transform: "perspective(1000px) rotateY(-5deg) rotateX(2deg)",
							transition: "transform 0.3s ease",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = "perspective(1000px) rotateY(-5deg) rotateX(2deg)";
						}}
					>
						{/* Inner glow effect */}
						<div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-50"></div>

						{/* Content */}
						<div className="relative z-10 space-y-6">
							{/* Icon or Logo placeholder */}
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/>
								</svg>
							</div>

							{/* Heading */}
							<h2 className="text-4xl lg:text-5xl font-light leading-tight text-white">
								Welcome back to{" "}
								<span className="block mt-2 text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
									<ShinyText text="Learnalyzer" disabled={false} speed={5} />
								</span>
							</h2>

							{/* Description */}
							<p className="text-gray-300 text-lg leading-relaxed">
								Continue your learning journey and achieve your goals with data-driven insights
							</p>

							{/* Feature list */}
							<div className="space-y-3 pt-4">
								{["Track your progress", "Get personalized insights", "Achieve your learning goals"].map(
									(feature, index) => (
										<div key={index} className="flex items-center space-x-3 text-gray-200">
											<div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											</div>
											<span className="text-sm">{feature}</span>
										</div>
									)
								)}
							</div>

							{/* Decorative bottom line */}
							<div className="flex items-center space-x-2 pt-6">
								<div className="w-12 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
								<div className="w-8 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-60"></div>
								<div className="w-4 h-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30"></div>
							</div>
						</div>

						{/* 3D depth effect - shadow layers */}
						<div className="absolute -inset-1 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl -z-10"></div>
						<div className="absolute -inset-2 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl -z-20"></div>
					</div>

					{/* Floating elements for depth */}
					<div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-500/20 rounded-2xl backdrop-blur-sm rotate-12 animate-float"></div>
					<div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-500/20 rounded-2xl backdrop-blur-sm -rotate-12 animate-float-delayed"></div>
				</div>
			</div>

			{/* Right Side - Form Section */}
			<div className="flex w-full lg:w-1/2 items-center justify-center p-6 min-h-screen lg:min-h-0">
				<div className="w-full max-w-md">
					{/* Form header */}
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-foreground mb-2">Sign In</h1>
						<p className="text-muted-foreground">Welcome back! Please enter your details</p>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Email field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Email</label>
							<Input
								id="email"
								type="email"
								placeholder="you@example.com"
								{...register("email")}
								className={`h-12 rounded-full !bg-primary/10 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
									errors.email ? "border-destructive" : ""
								}`}
							/>
							{errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
						</div>

						{/* Password field */}
						<div className="space-y-2">
							<label className="text-sm font-medium text-foreground">Password</label>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								{...register("password")}
								className={`h-12 rounded-full !bg-primary/10 border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors ${
									errors.password ? "border-destructive" : ""
								}`}
							/>
							{errors.password && <p className="text-destructive text-xs">{errors.password.message}</p>}
						</div>

						{/* Remember me and Forgot password */}
						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="rememberMe"
									checked={rememberMe}
									onChange={(e) => setRememberMe(e.target.checked)}
									className="w-4 h-4 rounded border-border bg-secondary cursor-pointer accent-primary"
								/>
								<label htmlFor="rememberMe" className="text-sm text-muted-foreground cursor-pointer">
									Remember me
								</label>
							</div>
							<Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
								Forgot password?
							</Link>
						</div>

						{/* Submit button */}
						<Button
							type="submit"
							disabled={mutation.isPending}
							className="w-full rounded-full bg-white h-12 mt-6 hover:bg-white/90 text-black font-semibold transition-colors duration-300"
						>
							{mutation.isPending ? "Signing in..." : "Sign In"}
						</Button>
					</form>

					{/* Sign up link */}
					<div className="mt-6 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link href="/auth/sign-up" className="text-white hover:text-white/80 font-medium transition-colors">
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
