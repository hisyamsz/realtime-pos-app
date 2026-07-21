import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/validation/auth-validation';

export async function loginWithPassword(data: LoginForm) {
  const supabase = await createClient({});
  return await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });
}
