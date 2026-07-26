import { LoginForm } from '@/validation/auth-validation';

export interface LoginFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  message?: string;
}

export interface Profile {
  id?: string;
  name?: string;
  avatar_url?: string;
  role?: string;
}

export interface CreateUserFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: {
    email?: string[];
    password?: string[];
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
  message?: string;
}

export interface UpdateUserFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: {
    id?: string[];
    name?: string[];
    role?: string[];
    avatar_url?: string[];
    _form?: string[];
  };
  message?: string;
}
