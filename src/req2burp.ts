import { AxiosRequestConfig } from './type';
import url from 'url';

/**
 * Check if object is empty or not (is it equal {}?)
 * @param {any} obj - Object to be check empty
 * @return {boolean} - True/False indicate input object is empty or not
 */
function isObjectEmpty(obj: any): boolean {
  return obj && Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}

/**
 * Try to parse url path in HTTP from Axios Request
 * @param {AxiosRequestConfig} req - Input axios request
 * @return {string} - The url path in HTTP
 */
function tryParsePath(req: Partial<AxiosRequestConfig>): string {
  try {
    const params = new URLSearchParams(req.params);
    let u = req.url || '/';
    if (!isObjectEmpty(req.params)) u += `?${params}`;
    const parsedUrl = url.parse(u);
    return parsedUrl.path || '/';
  } catch (err) {
    return '/';
  }
}

/**
 * Try to get host header in HTTP from Axios Request
 * @param {AxiosRequestConfig} req - Input axios request
 * @return {string} - The host header in HTTP
 */
function tryGetHostname(req: AxiosRequestConfig): string | undefined {
  if (req.baseURL) return url.parse(req.baseURL).host || undefined;
  return url.parse(req.url || '/').host || undefined;
}

/**
 * Parse from Axios Request to Burp-like HTTP message
 * [Optional] if autoAddHeader is set then this function will try to include missing HTTP headers
 * For example: Content-Length HTTP header
 *
 * @param {AxiosRequestConfig} req - Input axios request
 * @param {boolean} autoAddHeader - Turn on this option to auto add missing HTTP headers
 * @return {string} - The result burp HTTP message
 */
export function requestToBurp(req: AxiosRequestConfig, autoAddHeader: boolean = false): string {
  req.headers = req.headers || {};
  req.url = req.url ?? '/';
  req.params = req.params ?? {};
  req.method = req.method ?? 'GET';
  req.httpVersion = req.httpVersion ?? 'HTTP/1.1';

  const url = tryParsePath(req);
  let msg = `${req.method} ${url} ${req.httpVersion}\r\n`;

  const body = req.data ?? '';

  if (autoAddHeader) {
    const hostHeader = tryGetHostname(req);
    if (hostHeader) req.headers['Host'] = req.headers['Host'] || hostHeader;
    req.headers['Content-Length'] = req.headers['Content-Length'] || body.length;
    req.headers['Connection'] = req.headers['Connection'] || 'close';
  }

  if (req.headers) {
    for (const key in req.headers) {
      if (req.headers.hasOwnProperty(key)) {
        const value = req.headers[key];
        msg += `${key}: ${value}\r\n`;
      }
    }
  }
  msg += '\r\n';
  if (body) msg += body;
  return msg;
}
