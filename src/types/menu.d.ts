export interface MenuFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors: Record<string, string[] | undefined>;
  message?: string;
}
