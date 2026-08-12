'use server';

import { verifyAdminAuth } from '@/actions/auth-action';
import { deleteFile, uploadFile } from '@/actions/storage-action';
import { createClient } from '@/lib/supabase/server';
import { MenuFormState } from '@/types/menu';
import {
  createMenuSchema,
  updateMenuSchema,
} from '@/validation/menu-validation';

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
      rawDiscount !== null && rawDiscount !== '' ? Number(rawDiscount) : 0,
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

export async function updateMenu(
  prevState: MenuFormState,
  formData: FormData,
): Promise<MenuFormState> {
  const rawImage = formData.get('image_url');
  const rawPrice = formData.get('price');
  const rawDiscount = formData.get('discount');
  const isAvailableRaw = formData.get('is_available');

  const validatedFields = updateMenuSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    price: rawPrice !== null && rawPrice !== '' ? Number(rawPrice) : undefined,
    discount:
      rawDiscount !== null && rawDiscount !== '' ? Number(rawDiscount) : 0,
    image_url:
      rawImage instanceof File && rawImage.size > 0
        ? rawImage
        : typeof rawImage === 'string' && rawImage !== ''
          ? rawImage
          : undefined,
    is_available: isAvailableRaw !== null ? isAvailableRaw === 'true' : true,
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

  const auth = await verifyAdminAuth('update menus');
  if (!auth.isAuthorized) {
    return {
      status: 'error',
      errors: { ...prevState?.errors, _form: [auth.error!] },
    };
  }

  let imageUrl: string | undefined =
    typeof validatedFields.data.image_url === 'string'
      ? validatedFields.data.image_url
      : undefined;

  if (validatedFields.data.image_url instanceof File) {
    const oldImageUrl = formData.get('old_image_url') as string | null;
    const prevPath = oldImageUrl ? oldImageUrl.split('/images/')[1] : undefined;

    const { errors, data } = await uploadFile(
      'images',
      'menus',
      validatedFields.data.image_url,
      prevPath,
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
  const { id, name, description, category, price, discount, is_available } =
    validatedFields.data;

  const { error } = await supabase
    .from('menus')
    .update({
      name,
      description,
      category,
      price,
      discount,
      image_url: imageUrl,
      is_available,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

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
    message: 'Menu updated successfully',
  };
}

export async function deleteMenu(
  _prevState: BaseFormState,
  formData: FormData,
): Promise<BaseFormState> {
  const id = formData.get('id') as string;
  if (!id)
    return { status: 'error', errors: { _form: ['Menu ID is required'] } };

  const auth = await verifyAdminAuth('delete menus');
  if (!auth.isAuthorized) {
    return { status: 'error', errors: { _form: [auth.error!] } };
  }

  const supabase = await createClient({});

  const { data: menu } = await supabase
    .from('menus')
    .select('image_url')
    .eq('id', id)
    .single();

  if (menu?.image_url) {
    const prevPath = menu.image_url.split('/images/')[1];
    if (prevPath) {
      const fileDeleteResult = await deleteFile('images', prevPath);
      const fileError = fileDeleteResult.errors?._form?.[0];
      if (fileError && !/not found|404/i.test(fileError)) {
        return { status: 'error', errors: { _form: [fileError] } };
      }
    }
  }

  const { error } = await supabase.from('menus').delete().eq('id', id);
  if (error) return { status: 'error', errors: { _form: [error.message] } };

  return {
    status: 'success',
    errors: {},
    message: 'Menu deleted successfully',
  };
}
