'use server'
import { createClient } from "@libsql/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // Tambahkan ini
import { jwtVerify } from "jose"; // Tambahkan ini


const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function updateLayout(id: number, formData: FormData) {
  // Tambahkan Auth Check juga di updateLayout biar makin aman
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) throw new Error("Unauthorized");
  
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secret);

  const th_level = parseInt(formData.get("th_level") as string);
  const base_tag = formData.get("base_tag") as string;
  const copy_link = formData.get("copy_link") as string;
  const image_url = formData.get("image_url") as string;
  const description = formData.get("description") as string;
  const source_type = formData.get("source_type") as string;
  const source_url = formData.get("source_url") as string;
  const is_active = formData.get("is_active") === "on" ? 1 : 0;

  await client.execute({
    sql: `UPDATE layouts SET 
          th_level = ?, base_tag = ?, copy_link = ?, image_url = ?, 
          description = ?, source_type = ?, source_url = ?, is_active = ? 
          WHERE id = ?`,
    args: [th_level, base_tag, copy_link, image_url, description, source_type, source_url, is_active, id],
  });

  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteLayout(id: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) throw new Error("Unauthorized");

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  await jwtVerify(token, secret);

  await client.execute({
    sql: "DELETE FROM layouts WHERE id = ?",
    args: [id],
  });

  revalidatePath("/admin/dashboard");
  // Untuk delete tidak perlu redirect, cukup revalidate biar tabelnya refresh
}