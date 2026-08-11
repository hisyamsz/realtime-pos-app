import z from 'zod';

export const menuSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be at most 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z
      .number({ message: 'Price is required' })
      .positive('Price must be at least 1'),
  ),
  discount: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? 0 : Number(val),
    z
      .number({ message: 'Discount must be a number' })
      .min(0, 'Discount must be at least 0')
      .max(100, 'Discount must be at most 100'),
  ),
  image_url: z.union([z.string(), z.instanceof(File)]),
  is_available: z.boolean(),
});

export const createMenuSchema = menuSchema.extend({
  image_url: z.instanceof(File, {
    message: 'Image is required',
  }),
});

export const updateMenuSchema = menuSchema.extend({
  id: z.union([z.number(), z.string()]),
  image_url: z.union([z.string(), z.instanceof(File)], {
    message: 'Image is required',
  }),
});

export type Menu = z.infer<typeof menuSchema> & { id: number | string };
export type CreateMenuForm = z.input<typeof createMenuSchema>;
export type UpdateMenuForm = z.input<typeof updateMenuSchema>;
