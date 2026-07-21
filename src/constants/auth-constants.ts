import { LoginFormState } from '@/types/auth';

export const INITIAL_LOGIN_FORM = {
  email: '',
  password: '',
};

export const INITIAL_STATE_LOGIN_FORM: LoginFormState = {
  status: 'idle',
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};
