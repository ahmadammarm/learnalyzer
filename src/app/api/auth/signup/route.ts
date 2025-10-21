/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { SignupSchema } from "@/schemas/SignupSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const parseResult = SignupSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json(
                { success: false, errors: parseResult.error.format() },
                { status: 400 }
            );
        }

        const { email, name, password } = parseResult.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User with this email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "User created successfully",
                user: { id: newUser.id, email: newUser.email, name: newUser.name },
            },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
