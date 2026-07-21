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
