'use server'

import { createClient } from "@libsql/client";
import { revalidatePath } from "next/cache";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function incrementViewCount(layoutId: number) {
  try {
    await client.execute({
      sql: "UPDATE layouts SET view_count = view_count + 1 WHERE id = ?",
      args: [layoutId],
    });
    revalidatePath("/layout");
    return { success: true };
  } catch (error) {
    console.error("Error incrementing view count:", error);
    return { success: false, error: "Failed to update view count" };
  }
}

export async function incrementLikeCount(layoutId: number) {
  try {
    await client.execute({
      sql: "UPDATE layouts SET like_count = like_count + 1 WHERE id = ?",
      args: [layoutId],
    });
    revalidatePath("/layout");
    return { success: true };
  } catch (error) {
    console.error("Error incrementing like count:", error);
    return { success: false, error: "Failed to update like count" };
  }
}
