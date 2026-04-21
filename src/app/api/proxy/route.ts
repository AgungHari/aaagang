import { createClient } from "@libsql/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // Amankan kredensial di server side
    const client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    try {
        const body = await req.json();
        const { sql, args } = body;

        // Eksekusi SQL yang dikirim dari HTML
        const result = await client.execute({ sql, args });
        
        return NextResponse.json(result);
    } catch (e: any) {
        console.error("Proxy Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}