import { clsx, type ClassValue } from 'clsx';
import { ChangeEvent } from 'react';
import { twMerge } from 'tailwind-merge';
import { MAX_FILE_SIZE_MB, ALLOWED_IMAGE_TYPES } from '@/constants/file-constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files![0];
  const displayUrl = URL.createObjectURL(file);
  return { file, displayUrl };
}

/**
 * Validates image size and MIME type.
 * @returns Error string if validation fails, or null if valid.
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = MAX_FILE_SIZE_MB,
  allowedTypes: string[] = ALLOWED_IMAGE_TYPES
): string | null {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size is too large. Maximum size is ${maxSizeMB}MB.`;
  }
  if (!allowedTypes.includes(file.type)) {
    return `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}.`;
  }
  return null;
}
