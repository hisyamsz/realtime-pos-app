'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export async function logoutAction() {
  const supabase = await createClient({});
  await supabase.auth.signOut();

  const cookiesStore = await cookies();
  cookiesStore.delete('user_profile');

  revalidatePath('/', 'layout');
}
