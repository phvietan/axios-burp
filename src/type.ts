export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'
  | 'purge' | 'PURGE'
  | 'link' | 'LINK'
  | 'unlink' | 'UNLINK';

export interface AxiosRequestConfig {
  httpVersion?: string;
  url?: string;
  baseURL?: string;
  method?: Method;
  headers?: Record<string, string | number | boolean>;
  params?: any;
  data?: string;
}
