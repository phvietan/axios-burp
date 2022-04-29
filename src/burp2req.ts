import url from 'url';
import { AxiosRequestConfig, Method } from './type';

/**
 * Try to parse URLSearchParams to javascript object
 * @param {URLSearchParams} entries - Input URLSearchParams
 * @return {Record<string, string>} - The result javascript object
 */
function paramsToObject(entries: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

/**
 * Parse first line of Burp HTTP message
 *
 * @param {string} firstLine - firstLine of Burp HTTP message
 * @return {{}} - The method, path, params, httpVersion of Burp HTTP message
 */
export function convertFirstLineBurp(firstLine: string): {
  method: string,
  path: string,
  params: Record<string, string>,
  httpVersion: string,
} {
  const arr = firstLine.split(' ');
  const method = arr[0];
  const httpVersion = arr[arr.length - 1];

  let lastWhitespace = firstLine.length + 1;
  for (let i = firstLine.length - 1; i >= 0; --i) {
    if (firstLine[i] === ' ') {
      lastWhitespace = i;
      break;
    }
  }
  if (lastWhitespace === firstLine.length + 1) throw new Error('First line wrong format: should at least have 1 space between path and http version');

  const parsedPath = url.parse(firstLine.slice(method.length + 1, lastWhitespace));
  const parsedParams = new URLSearchParams(parsedPath.query || '');

  return {
    method,
    path: parsedPath.pathname || '/',
    params: paramsToObject(parsedParams),
    httpVersion,
  };
}

/**
 * Try to parse burp HTTP message to Axios with input delimiter
 *
 * @param {string} burp - burp HTTP message
 * @param {string} delimiter - delimiter between lines of HTTP message, could be '\r\n' or '\n' only
 * @param {boolean} force - forcefully parse the message, if set to false it will return when it find something funny
 * @return {AxiosRequestConfig} - The result Axios
 */
function tryParseWithDelimiter(burp: string, delimiter: string, force = false): AxiosRequestConfig {
  const arr = burp.split(delimiter);
  if (arr.length === 1 && !force) throw new Error('Something is wrong with delimiter');

  let headers: string[] = [];
  let body = undefined;
  // The split between http header and body
  const splittedHeaderBody = arr.indexOf('');
  if (splittedHeaderBody !== -1) {
    headers = arr.slice(1, splittedHeaderBody);
    body = arr.slice(splittedHeaderBody + 1).join(delimiter);
  } else {
    headers = arr.slice(1);
  }

  const { method, path, params, httpVersion } = convertFirstLineBurp(arr[0]);

  const req: AxiosRequestConfig = {
    method: method as Method,
    url: path,
    data: body,
    params,
    headers: {},
    httpVersion,
  };

  headers.forEach((h) => {
    const delimiter = h.indexOf(': ');
    if (delimiter === -1) return;
    const key = h.slice(0, delimiter);
    const value = h.slice(delimiter + 2);
    req.headers = {
      ...req.headers,
      [key]: value,
    };
  });

  return req;
}

/**
 * Try to parse burp HTTP message to Axios
 *
 * @param {string} burp - burp HTTP message
 * @return {AxiosRequestConfig} - The result Axios
 */
export function burpToRequest(burp: string): AxiosRequestConfig {
  try {
    const parsedObj = tryParseWithDelimiter(burp, '\r\n');
    return parsedObj;
  } catch (err) {
    const parsedObj = tryParseWithDelimiter(burp, '\n', true);
    return parsedObj;
  }
}
