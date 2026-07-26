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
