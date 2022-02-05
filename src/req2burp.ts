import { AxiosRequestConfig } from "./type";
import url from 'url';

function tryParsePath(req: Partial<AxiosRequestConfig>) {
  req.url = req.url ?? '/';
  try {
    const parsedUrl = url.parse(req.url);
    return parsedUrl.pathname || '/';
  } catch (err) { return '/'; }
}

function tryGetHostname(req: Partial<AxiosRequestConfig>): string | undefined {
  if (req.baseURL) return url.parse(req.baseURL).hostname || undefined;
  return url.parse(req.url || '/').host || undefined;
}

export function requestToBurp(req: Partial<AxiosRequestConfig>, autoAddHeader: boolean = false): string {
  req.headers = req.headers || {};

  const method = req.method ?? 'GET';
  const url = tryParsePath(req);

  let msg = `${method} ${url} HTTP/1.1\r\n`;

  const body = req.data ?? '';

  if (autoAddHeader) {
    const hostHeader = tryGetHostname(req);
    if (hostHeader) req.headers['Host'] = req.headers['Host'] || hostHeader;
    req.headers['Content-Length'] = req.headers['Content-Length'] || body.length;
    req.headers['Connection'] = req.headers['Connection'] || 'close';
  }

  if (req.headers) {
    for (var key in req.headers) {
      const value = req.headers[key];
      msg += `${key}: ${value}\r\n`;
    }
  }
  msg += '\r\n';
  if (body) msg += body;
  return msg;
}
