'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function verifyAdminAuth(actionName: string) {
  const supabase = await createClient({});
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAuthorized: false,
      error: 'Unauthorized: You must be logged in',
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return {
      isAuthorized: false,
      error: `Forbidden: Only admins can ${actionName}`,
    };
  }

  return { isAuthorized: true };
}

export async function logoutAction() {
  try {
    const supabase = await createClient({});
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    const cookiesStore = await cookies();
    cookiesStore.delete('user_profile');

    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
