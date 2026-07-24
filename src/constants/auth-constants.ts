import { CreateUserFormState, LoginFormState, Profile } from '@/types/auth';
import { CreateUserForm } from '@/validation/auth-validation';

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

export const INITIAL_CREATE_USER_FORM: CreateUserForm = {
  name: '',
  role: '',
  avatar_url: '',
  email: '',
  password: '',
};

export const INITIAL_STATE_CREATE_USER: CreateUserFormState = {
  status: 'idle',
  errors: {
    email: [],
    password: [],
    name: [],
    role: [],
    avatar_url: [],
    _form: [],
  },
};

export const ROLE_LIST = [
  {
    value: 'admin',
    label: 'Admin',
  },
  {
    value: 'cashier',
    label: 'Cashier',
  },
  {
    value: 'kitchen',
    label: 'Kitchen',
  },
];
