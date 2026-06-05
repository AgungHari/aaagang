'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  
  // Clear the admin token cookie
  cookieStore.delete('admin_token');

  // Redirect to login page
  redirect('/admin/login');
}
