/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, getServerSession, DefaultSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { compare } from "bcryptjs";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import prisma from "./prisma";
import { SigninSchema } from "@/schemas/SigninSchema";


declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "student" | "admin";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "student" | "admin";
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },

    jwt: {
        maxAge: 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,

    pages: {
        signIn: "/auth/sign-in",
    },

    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@mail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) throw new Error("Credentials undefined");

                const validation = SigninSchema.safeParse(credentials);
                if (!validation.success) {
                    throw new Error("Invalid email or password");
                }

                const { email, password } = credentials as z.infer<typeof SigninSchema>;

                const user = await prisma.user.findUnique({ where: { email } });


                if (!user) throw new Error("Incorrect email");

                if (!user.password) {
                    throw new Error("Email is already exist with google authentication")
                }

                const isPasswordCorrect = await compare(password, user.password || "");
                if (!isPasswordCorrect) throw new Error("Incorrect password");

                await prisma.user.upsert({
                    where: { id: user.id },
                    update: {},
                    create: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password || "",
                        role: user.role,
                    },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
        // GoogleProvider({
        //     clientId: process.env.GOOGLE_CLIENT_ID!,
        //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        //     authorization: {
        //         params: {
        //             prompt: "select_account"
        //         }
        //     }
        // })
    ],

    callbacks: {

        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role;

                token.expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
            }

            if (typeof token.expiresAt === "number" && Date.now() / 1000 > token.expiresAt) {
                return {};
            }


            if (account && account.provider === "google") {
                token.accessToken = account.access_token;
            }

            return token;
        },

        async session({ session, token }) {

            if (!token?.id) {
                return {
                    ...session,
                    user: undefined,
                };
            }

            session.user = {
                id: token.id as string,
                name: token.name as string,
                email: token.email as string,
                role: (token.role as "student" | "admin") || "student",
            };

            return session;
        },
    }

};

export function auth(
    ...args:
        | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
        | [NextApiRequest, NextApiResponse]
        | []
) {
    return getServerSession(...args, authOptions);
}