'use server';

import { createClient } from '@supabase/supabase-js';
import { environment } from '@/configs/environment';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/constants/file-constants';

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  prevPath?: string,
) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      status: 'error',
      errors: {
        _form: ['File size exceeds the 2MB limit.'],
      },
    };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      status: 'error',
      errors: {
        _form: ['Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.'],
      },
    };
  }

  const supabase = createClient(
    environment.SUPABASE_URL!,
    environment.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const newPath = `${path}/${Date.now()}-${file.name}`;

  if (prevPath) {
    const { error } = await supabase.storage.from(bucket).remove([prevPath]);
    if (error) {
      return {
        status: 'error',
        errors: {
          _form: [error.message],
        },
      };
    }
  }

  const { error } = await supabase.storage.from(bucket).upload(newPath, file);
  if (error) {
    return {
      status: 'error',
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: 'success',
    data: {
      url: `${environment.SUPABASE_URL}/storage/v1/object/public/${bucket}/${newPath}`,
      path: newPath,
    },
  };
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient(
    environment.SUPABASE_URL!,
    environment.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return {
      status: 'error',
      errors: {
        _form: [error.message],
      },
    };
  }

  return {
    status: 'success',
  };
}
