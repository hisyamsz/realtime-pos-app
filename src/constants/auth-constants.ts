import { LoginFormState, Profile } from '@/types/auth';

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

export const INITIAL_STATE_PROFILE: Profile = {
  id: '',
  name: '',
  avatar_url: '',
  role: '',
};

