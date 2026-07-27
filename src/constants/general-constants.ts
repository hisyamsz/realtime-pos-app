import { BaseFormState } from '@/types/general';

export const INITIAL_STATE_ACTION: BaseFormState = {
  status: 'idle',
  errors: {
    _form: [],
  },
};
