'use server'

import { createClient } from "@libsql/client";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export async function createLayout(formData: FormData) {
  // Auth Check
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) throw new Error("Unauthorized");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secret);

  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  const th_level = parseInt(formData.get("th_level") as string);
  const base_tag = formData.get("base_tag") as string;
  const copy_link = formData.get("copy_link") as string;
  const image_url = formData.get("image_url") as string;
  const description = formData.get("description") as string;
  const source_type = formData.get("source_type") as string;
  const source_url = formData.get("source_url") as string;

  await client.execute({
    sql: `INSERT INTO layouts (th_level, base_tag, copy_link, image_url, description, source_type, source_url) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [th_level, base_tag, copy_link, image_url, description, source_type, source_url],
  });

  redirect("/admin/dashboard");
}