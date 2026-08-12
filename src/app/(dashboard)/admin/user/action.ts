'use server';

import { verifyAdminAuth } from '@/actions/auth-action';
import { deleteFile, uploadFile } from '@/actions/storage-action';
import { createClient } from '@/lib/supabase/server';
import { CreateUserFormState, UpdateUserFormState } from '@/types/auth';
import {
  createUserSchema,
  updateUserSchema,
} from '@/validation/auth-validation';

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

export async function deleteUser(
  prevState: BaseFormState,
  formData: FormData,
): Promise<BaseFormState> {
  const id = formData.get('id') as string;

  if (!id) {
    return {
      status: 'error',
      errors: {
        ...prevState?.errors,
        _form: ['User ID is required'],
      },
    };
  }

  const auth = await verifyAdminAuth('delete users');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { ...prevState?.errors, _form: [auth.error!] },
    };
  }

  const clientSupabase = await createClient({});
  const {
    data: { user: currentUser },
  } = await clientSupabase.auth.getUser();

  if (currentUser?.id === id) {
    return {
      status: 'error',
      errors: {
        ...prevState?.errors,
        _form: ['Admins cannot delete their own account'],
      },
    };
  }

  const supabase = await createClient({ isAdmin: true });

  const { data: profile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', id)
    .single();

  if (profile?.avatar_url) {
    const prevPath = profile.avatar_url.split('/images/')[1];
    if (prevPath) {
      const fileDeleteResult = await deleteFile('images', prevPath);
      if (
        fileDeleteResult.status === 'error' &&
        fileDeleteResult.errors?._form?.[0]
      ) {
        const errorMsg = fileDeleteResult.errors._form[0].toLowerCase();
        const isNotFound =
          errorMsg.includes('not found') || errorMsg.includes('404');

        if (!isNotFound) {
          return {
            status: 'error',
            errors: {
              ...prevState?.errors,
              _form: [fileDeleteResult.errors._form[0]],
            },
          };
        }
      }
    }
  }

  const { error } = await supabase.auth.admin.deleteUser(id);

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
    message: 'User deleted successfully',
  };
}
