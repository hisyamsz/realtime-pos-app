'use server';

import z from 'zod';
import { createClient } from '@/lib/supabase/server';
import { CreateUserFormState, UpdateUserFormState } from '@/types/auth';
import { createUserSchema, updateUserSchema } from '@/validation/auth-validation';
import { uploadFile } from '@/actions/storage-action';
import { INITIAL_STATE_UPDATE_USER } from '@/constants/auth-constants';

async function verifyAdminAuth(actionName: string) {
  const authClient = await createClient({});
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) {
    return { isAuthorized: false, error: 'Unauthorized: You must be logged in' };
  }

  const { data: profile } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return { isAuthorized: false, error: `Forbidden: Only admins can ${actionName}` };
  }

  return { isAuthorized: true, user };
}

async function handleAvatarUpload(avatarUrl: unknown): Promise<{ avatarUrlString?: string; error?: string }> {
  if (avatarUrl instanceof File && avatarUrl.size > 0) {
    const uploadResult = await uploadFile('images', 'users', avatarUrl);
    if (uploadResult.status === 'error') {
      return { error: uploadResult.errors?._form?.[0] || 'Failed to upload avatar image' };
    }
    return { avatarUrlString: uploadResult.data?.url };
  }

  if (typeof avatarUrl === 'string' && avatarUrl.length > 0) {
    return { avatarUrlString: avatarUrl };
  }

  return { avatarUrlString: undefined };
}

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

  const auth = await verifyAdminAuth('create users');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { _form: [auth.error!] },
    };
  }

  const avatarResult = await handleAvatarUpload(validatedFields.data.avatar_url);
  if (avatarResult.error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [avatarResult.error],
      },
    };
  }

  const avatarUrlString = avatarResult.avatarUrlString;
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

export async function updateUser(
  prevState: UpdateUserFormState,
  formData: FormData | null,
): Promise<UpdateUserFormState> {
  if (!formData) {
    return INITIAL_STATE_UPDATE_USER;
  }

  const avatarFile = formData.get('avatar_url');
  const hasAvatarFile = avatarFile instanceof File && avatarFile.size > 0;
  const hasAvatarString = typeof avatarFile === 'string' && avatarFile.length > 0;

  const validatedFields = updateUserSchema.safeParse({
    id: formData.get('id'),
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

  const auth = await verifyAdminAuth('update users');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { _form: [auth.error!] },
    };
  }

  const avatarResult = await handleAvatarUpload(validatedFields.data.avatar_url);
  if (avatarResult.error) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [avatarResult.error],
      },
    };
  }

  const supabase = await createClient({ isAdmin: true });
  const { id, name, role } = validatedFields.data;
  const avatar_url = avatarResult.avatarUrlString;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name,
      role,
      avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (profileError) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [profileError.message],
      },
    };
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { name, role, avatar_url },
  });

  if (authError) {
    return {
      status: 'error',
      errors: {
        ...prevState.errors,
        _form: [authError.message],
      },
    };
  }

  return {
    status: 'success',
    errors: {},
    message: 'User updated successfully',
  };
}
