'use server';

import z from 'zod';
import { createClient } from '@/lib/supabase/server';
import { CreateUserFormState } from '@/types/auth';
import { createUserSchema } from '@/validation/auth-validation';
import { uploadFile } from '@/actions/storage-action';

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
  const avatarFile = formData.get('avatar_url');
  const hasAvatarFile = avatarFile instanceof File && avatarFile.size > 0;
  const hasAvatarString = typeof avatarFile === 'string' && avatarFile.length > 0;

  const validatedFields = createUserSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    role: formData.get('role'),
    avatar_url: hasAvatarFile ? avatarFile : (hasAvatarString ? avatarFile : undefined),
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

  let avatarUrlString: string | undefined = undefined;

  if (validatedFields.data.avatar_url instanceof File) {
    const uploadResult = await uploadFile('images', 'users', validatedFields.data.avatar_url);
    if (uploadResult.status === 'error') {
      return {
        status: 'error',
        errors: {
          ...prevState.errors,
          _form: uploadResult.errors?._form || ['Failed to upload avatar image'],
        },
      };
    }
    avatarUrlString = uploadResult.data?.url;
  } else if (typeof validatedFields.data.avatar_url === 'string') {
    avatarUrlString = validatedFields.data.avatar_url;
  }

  const supabase = await createClient({ isAdmin: true });

  const { error } = await supabase.auth.admin.createUser({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    user_metadata: {
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: avatarUrlString,
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
