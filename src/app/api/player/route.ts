import { getPlayerData } from "@/lib/player";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (!tag) {
      return NextResponse.json({ error: "Tag parameter is required" }, { status: 400 });
    }

    const player = await getPlayerData(tag);

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error fetching player data:", error);
    return NextResponse.json({ error: "Failed to fetch player data" }, { status: 500 });
  }
}
