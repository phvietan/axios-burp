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
  console.log(parsed);
  let origin = protocol + '//' + host;
  return origin;
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
  req.headers = req.headers || {};
  req.method = req.method ?? 'GET';
  req.httpVersion = req.httpVersion ?? 'HTTP/1.1';

  const path = tryParsePath(req);
  let msg = `${req.method} ${path} ${req.httpVersion}\r\n`;

  const body = req.body ?? '';

  if (autoAddHeader) {
    const hostHeader = tryGetHostname(req);
    const originHeader = tryGetOrigin(req);
    if (hostHeader) req.headers['Host'] = req.headers['Host'] || hostHeader;
    if (originHeader) req.headers['Origin'] = req.headers['Origin'] || originHeader;
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
