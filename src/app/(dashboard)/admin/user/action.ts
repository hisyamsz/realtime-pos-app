'use server';

import z from 'zod';
import { createClient } from '@/lib/supabase/server';
import { CreateUserFormState } from '@/types/auth';
import { createUserSchema } from '@/validation/auth-validation';

export async function createUser(
  prevState: CreateUserFormState,
  formData: FormData | null,
): Promise<CreateUserFormState> {
  if (!formData) {
    return {
      status: 'idle',
      errors: {
        email: [],
        password: [],
        name: [],
        role: [],
        avatar_url: [],
        _form: [],
      },
    };
  }
  const validatedFields = createUserSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    role: formData.get('role'),
    // avatar_url: formData.get('avatar_url'),
  });

  if (!validatedFields.success) {
    const fieldErrors = z.flattenError(validatedFields.error).fieldErrors;
    return {
      status: 'error',
      errors: {
        ...fieldErrors,
        _form: [],
      },
    };
  }

  const authClient = await createClient({});
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      errors: { _form: ['Unauthorized: You must be logged in'] },
    };
  }

  const { data: profile } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return {
      status: 'error',
      errors: { _form: ['Forbidden: Only admins can create users'] },
    };
  }

  const supabase = await createClient({ isAdmin: true });

  const { error } = await supabase.auth.admin.createUser({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    user_metadata: {
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      // avatar_url: validatedFields.data.avatar_url,
    },
    email_confirm: true,
  });

  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: 'success',
    errors: {},
    message: 'User created successfully',
  };
}
