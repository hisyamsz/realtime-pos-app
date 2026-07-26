import z from 'zod';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '@/constants/file-constants';
import { HAS_LETTER_OR_NUMBER_REGEX } from '@/constants/auth-constants';

export const loginSchema = z.object({
  email: z
    .email({ message: 'Please enter a valid email' })
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .max(100, 'Password must be at most 100 characters'),
});



const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(100, 'Name must be at most 100 characters')
  .refine((val) => val.trim().length > 0, {
    message: 'Name cannot be empty or whitespace only',
  })
  .refine((val) => HAS_LETTER_OR_NUMBER_REGEX.test(val), {
    message: 'Name must contain at least one letter or number',
  });

export const createUserSchema = z.object({
  name: nameSchema,
  email: z
    .email({ message: 'Please enter a valid email' })
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
  role: z.string().min(1, 'Please select a valid role'),
  avatar_url: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be 2MB or less')
        .refine(
          (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
          'Only JPEG, PNG, WEBP, and GIF images are allowed'
        ),
      z.string(),
    ])
    .optional()
    .nullable(),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, 'User ID is required'),
  name: nameSchema,
  role: z.string().min(1, 'Please select a valid role'),
  avatar_url: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be 2MB or less')
        .refine(
          (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
          'Only JPEG, PNG, WEBP, and GIF images are allowed'
        ),
      z.string(),
    ])
    .optional()
    .nullable(),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
