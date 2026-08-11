import { MenuFormState } from '@/types/menu';
import { CreateMenuForm } from '@/validation/menu-validation';

export const HEADER_TABLE_MENU = [
  'No',
  'Image',
  'Name',
  'Category',
  'Price',
  'Status',
  'Action',
];

export const MENU_CATEGORIES = [
  { value: 'main course', label: 'Main Course' },
  { value: 'appetizer', label: 'Appetizer' },
  { value: 'beverage', label: 'Beverage' },
  { value: 'dessert', label: 'Dessert' },
];

export const MENU_STATUS = [
  { value: true, label: 'Available' },
  { value: false, label: 'Not Available' },
];

export const INITIAL_CREATE_MENU_FORM: CreateMenuForm = {
  name: '',
  description: '',
  category: '',
  price: '' as unknown as number,
  discount: 0,
  image_url: '' as unknown as File,
  is_available: true,
};

export const INITIAL_STATE_MENU: MenuFormState = {
  status: 'idle',
  errors: {},
};

export const INITIAL_STATE_CREATE_MENU: MenuFormState = INITIAL_STATE_MENU;
export const INITIAL_STATE_UPDATE_MENU: MenuFormState = INITIAL_STATE_MENU;
