import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; 

export const runtime = 'edge';

export async function POST(req: Request) {

    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);


        const client = createClient({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN!,
        });

        const body = await req.json();
        const { sql, args } = body;

        const result = await client.execute({ sql, args });
        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Proxy Error:", e);
        return NextResponse.json({ error: "Invalid session or query" }, { status: 500 });
    }
}