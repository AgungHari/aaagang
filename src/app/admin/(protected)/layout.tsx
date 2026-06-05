import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth Check - Verify JWT token
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
  } catch (error) {
    redirect('/admin/login');
  }

  // If auth passes, render with AdminLayout wrapper
  return <AdminLayout>{children}</AdminLayout>;
}
