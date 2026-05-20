import { getClanData, getClanDataByTag } from "@/lib/coc";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    let clan;
    if (tag) {
      // Jika ada parameter tag, fetch clan dengan tag tersebut
      clan = await getClanDataByTag(tag);
    } else {
      // Jika tidak ada parameter tag, fetch main clan (AAA GANG)
      clan = await getClanData();
    }

    if (!clan) {
      return NextResponse.json({ error: "Clan data not found" }, { status: 404 });
    }
    
    return NextResponse.json(clan);
  } catch (error) {
    console.error("Error fetching clan data:", error);
    return NextResponse.json({ error: "Failed to fetch clan data" }, { status: 500 });
  }
}
