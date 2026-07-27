'use server';

import { uploadFile } from '@/actions/storage-action';
import { createClient } from '@/lib/supabase/server';
import { CreateUserFormState, UpdateUserFormState } from '@/types/auth';
import {
  createUserSchema,
  updateUserSchema,
} from '@/validation/auth-validation';

async function verifyAdminAuth(actionName: string) {
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

export async function createUser(
  prevState: CreateUserFormState,
  formData: FormData,
): Promise<CreateUserFormState> {
  const avatarFile = formData.get('avatar_url');

  const validatedFields = createUserSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    name: formData.get('name'),
    role: formData.get('role'),
    avatar_url:
      avatarFile instanceof File && avatarFile.size > 0
        ? avatarFile
        : undefined,
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const auth = await verifyAdminAuth('create users');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { ...prevState?.errors, _form: [auth.error!] },
    };
  }

  let avatarUrl: string | undefined = undefined;

  if (validatedFields.data.avatar_url instanceof File) {
    const { errors, data } = await uploadFile(
      'images',
      'users',
      validatedFields.data.avatar_url,
    );

    if (errors || !data) {
      return {
        status: 'error',
        errors: {
          ...prevState?.errors,
          _form: errors?._form || ['Failed to upload avatar'],
        },
      };
    }
    avatarUrl = data.url;
  }

  const supabase = await createClient({ isAdmin: true });

  const { error } = await supabase.auth.admin.createUser({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    user_metadata: {
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: avatarUrl,
    },
    email_confirm: true,
  });

  if (error) {
    return {
      status: 'error',
      errors: {
        ...prevState?.errors,
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
  formData: FormData,
): Promise<UpdateUserFormState> {
  const avatarFile = formData.get('avatar_url');

  const validatedFields = updateUserSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    role: formData.get('role'),
    avatar_url:
      avatarFile instanceof File && avatarFile.size > 0
        ? avatarFile
        : undefined,
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const auth = await verifyAdminAuth('update users');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { ...prevState?.errors, _form: [auth.error!] },
    };
  }

  let avatarUrl: string | undefined =
    typeof formData.get('avatar_url') === 'string'
      ? (formData.get('avatar_url') as string)
      : undefined;

  if (validatedFields.data.avatar_url instanceof File) {
    const oldAvatarUrl = formData.get('old_avatar_url') as string | null;
    const prevPath = oldAvatarUrl
      ? oldAvatarUrl.split('/images/')[1]
      : undefined;

    const { errors, data } = await uploadFile(
      'images',
      'users',
      validatedFields.data.avatar_url,
      prevPath,
    );

    if (errors || !data) {
      return {
        status: 'error',
        errors: {
          ...prevState?.errors,
          _form: errors?._form || ['Failed to upload avatar'],
        },
      };
    }
    avatarUrl = data.url;
  }

  const supabase = await createClient({ isAdmin: true });
  const { id, name, role } = validatedFields.data;

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      name,
      role,
      avatar_url: avatarUrl ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (profileError) {
    return {
      status: 'error',
      errors: {
        ...prevState?.errors,
        _form: [profileError.message],
      },
    };
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(id, {
    user_metadata: { name, role, avatar_url: avatarUrl ?? null },
  });

  if (authError) {
    return {
      status: 'error',
      errors: {
        ...prevState?.errors,
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
