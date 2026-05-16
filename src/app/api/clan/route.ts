import { getClanData } from "@/lib/coc";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clan = await getClanData();
    
    if (!clan) {
      return NextResponse.json({ error: "Clan data not found" }, { status: 404 });
    }
    
    return NextResponse.json(clan);
  } catch (error) {
    console.error("Error fetching clan data:", error);
    return NextResponse.json({ error: "Failed to fetch clan data" }, { status: 500 });
  }
}
