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
