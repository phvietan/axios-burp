export type HttpMethod =
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

export interface AxiosRequest {
  url: string;
  httpVersion?: string;
  method?: HttpMethod;
  headers?: Record<string, string | number | boolean>;
  body?: string;
}
