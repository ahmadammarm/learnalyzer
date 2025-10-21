/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { SigninSchema, SigninSchemaType } from "@/schemas/SigninSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function SigninForm() {

    const user = useSession().data?.user;
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.push("/dashboard");
        }
    }, [user, router]);

    const { register, handleSubmit, formState: { errors } } = useForm<SigninSchemaType>({
        resolver: zodResolver(SigninSchema),
    });

    const mutation = useMutation({
        mutationFn: async ({ data }: { data: SigninSchemaType }) => {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false
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
        <div className="min-h-screen flex flex-col lg:flex-row bg-cover bg-center overflow-hidden bg-transparent">

            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
                <Image
                    src="/assets/sign-in-baner.jpg"
                    alt="Login Illustration"
                    className="absolute inset-0 w-full h-full object-cover"
                    width={800}
                    height={600}
                />
                <div className="absolute inset-0 bg-black/80"></div>

                <div className="absolute bottom-10 left-8 right-8 text-white text-4xl font-semibold text-left">
                    A smart solution to manage your finances.
                </div>
            </div>

            <div className="flex w-full lg:w-1/2 items-center p-6 min-h-screen lg:min-h-0">
                <div className="w-full bg-transparent rounded-none lg:rounded-l-2xl p-10">
                    <h1 className="text-3xl font-bold mb-10 md:px-10">
                        Sign in
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:px-10">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                {...register("email")}
                                className={`w-full h-12 p-5 rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mb-5">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={`w-full h-12 p-5 rounded-md border ${errors.password ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <Link
                                className="underline text-sm text-gray-300 hover:text-gray-600"
                                href="/sign-up"
                            >
                                Don&apos;t have an account? Sign Up
                            </Link>

                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className={`ml-3 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors duration-300 ${mutation.isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {mutation.isPending ? "Signing in..." : "Sign in"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}