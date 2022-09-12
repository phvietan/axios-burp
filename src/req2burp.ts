import { AxiosRequest } from './type';
import url from 'url';

/**
 * Try to parse url path in HTTP from Axios Request
 * @param {AxiosRequest} req - Input axios request
 * @return {string} - The url path in HTTP
 */
export function tryParsePath(req: AxiosRequest): string {
  const parsedUrl = url.parse(req.url || '/');
  const hash = parsedUrl.hash || '';
  return parsedUrl.path + hash;
}

/**
 * Try to get host header in HTTP from Axios Request
 * @param {AxiosRequest} req - Input axios request
 * @return {string} - The host header in HTTP
 */
function tryGetHostname(req: AxiosRequest): string | undefined {
  return url.parse(req.url || '/').host || undefined;
}

/**
 * Try to get origin header in HTTP from Axios Request
 * @param {AxiosRequest} req - Input axios request
 * @return {string} - The host header in HTTP
 */
function tryGetOrigin(req: AxiosRequest): string | undefined {
  const parsed = url.parse(req.url);
  const { protocol, host } = parsed;
  if (!protocol || !host) return undefined;
  return protocol + '//' + host;
}

/**
 * Try to add header into header array
 * @param {string[]} headers - Header array
 * @param {string} newHeader - Newly adding header
 * @return {string[]} - The header array after tried to add new header
 */
function tryAddHeader(headers: string[], newHeader: string): string[] {
  const headerName = newHeader.split(':')[0];
  if (headers.find((h) => h.toLowerCase().startsWith(headerName.toLowerCase()))) return headers;
  const newHeaders = [
    ...headers,
    newHeader,
  ];
  return newHeaders;
}

/**
 * Parse from Axios Request to Burp-like HTTP message
 * [Optional] if autoAddHeader is set then this function will try to include missing HTTP headers
 * For example: Content-Length HTTP header
 *
 * @param {AxiosRequest} req - Input axios request
 * @param {boolean} autoAddHeader - Turn on this option to auto add missing HTTP headers
 * @return {string} - The result burp HTTP message
 */
export function requestToBurp(req: AxiosRequest, autoAddHeader: boolean = false): string {
  req.headers = req.headers || [];
  req.method = req.method ?? 'GET';
  req.httpVersion = req.httpVersion ?? 'HTTP/1.1';

  const path = tryParsePath(req);
  let msg = `${req.method} ${path} ${req.httpVersion}\r\n`;

  const body = req.body ?? '';

  if (autoAddHeader) {
    const hostHeader = tryGetHostname(req);
    const originHeader = tryGetOrigin(req);
    if (hostHeader) req.headers = tryAddHeader(req.headers, `Host: ${hostHeader}`);
    if (originHeader) req.headers = tryAddHeader(req.headers, `Origin: ${originHeader}`);
    req.headers = tryAddHeader(req.headers, `Content-Length: ${body.length}`);
    req.headers = tryAddHeader(req.headers, `Connection: close`);
  }

  msg += req.headers.reduce((prev, cur) => prev + cur + '\r\n', '') + '\r\n';
  if (body) msg += body;
  return msg;
}
