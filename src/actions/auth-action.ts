'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

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
