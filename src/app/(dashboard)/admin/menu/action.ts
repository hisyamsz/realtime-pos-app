'use server';

import { uploadFile } from '@/actions/storage-action';
import { createClient } from '@/lib/supabase/server';
import { MenuFormState } from '@/types/menu';
import { createMenuSchema } from '@/validation/menu-validation';

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

export async function createMenu(
  prevState: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  const imageFile = formData.get('image_url');
  const isAvailableRaw = formData.get('is_available');
  const isAvailable =
    isAvailableRaw !== null ? isAvailableRaw === 'true' : true;

  const rawPrice = formData.get('price');
  const rawDiscount = formData.get('discount');

  const validatedFields = createMenuSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    price: rawPrice !== null && rawPrice !== '' ? Number(rawPrice) : undefined,
    discount:
      rawDiscount !== null && rawDiscount !== ''
        ? Number(rawDiscount)
        : 0,
    image_url:
      imageFile instanceof File && imageFile.size > 0 ? imageFile : undefined,
    is_available: isAvailable,
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

  const auth = await verifyAdminAuth('create menus');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { ...prevState?.errors, _form: [auth.error!] },
    };
  }

  let imageUrl: string | undefined = undefined;

  if (validatedFields.data.image_url instanceof File) {
    const { errors, data } = await uploadFile(
      'images',
      'menus',
      validatedFields.data.image_url,
    );

    if (errors || !data) {
      return {
        status: 'error',
        errors: {
          ...prevState?.errors,
          _form: errors?._form || ['Failed to upload menu image'],
        },
      };
    }
    imageUrl = data.url;
  }

  const supabase = await createClient({});

  const { error } = await supabase.from('menus').insert({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    category: validatedFields.data.category,
    price: validatedFields.data.price,
    discount: validatedFields.data.discount,
    image_url: imageUrl,
    is_available: validatedFields.data.is_available,
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
    message: 'Menu created successfully',
  };
}

