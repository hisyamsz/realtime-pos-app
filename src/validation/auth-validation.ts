import z from 'zod';

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

export type LoginForm = z.infer<typeof loginSchema>;

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .email({ message: 'Please enter a valid email' })
    .min(1, 'Email is required')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be at most 100 characters'),
  role: z.enum(['admin', 'cashier', 'kitchen'], {
    message: 'Please select a valid role',
  }),
  avatar_url: z
    .union([
      z.custom<File>(
        (val) => typeof window !== 'undefined' && val instanceof File,
        { message: 'Invalid file format' }
      ),
      z.string(),
    ])
    .optional()
    .nullable(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
