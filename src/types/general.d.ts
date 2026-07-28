export {};

declare global {
  interface BaseResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }

  interface Preview {
    file?: File;
    displayUrl?: string;
  }

  interface BaseFormState {
    status: 'idle' | 'loading' | 'success' | 'error';
    errors?: {
      [key: string]: string[] | undefined;
      _form?: string[];
    };
    message?: string;
  }
}
