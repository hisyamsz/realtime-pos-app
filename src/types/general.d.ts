export interface BaseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface Preview {
  file?: File;
  displayUrl?: string;
}

export interface BaseFormState {
  status: 'idle' | 'loading' | 'success' | 'error';
  errors?: {
    [key: string]: string[] | undefined;
    _form?: string[];
  };
  message?: string;
}
