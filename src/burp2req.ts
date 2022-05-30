import url from 'url';
import { AxiosRequest, HttpMethod } from './type';

/**
 * Parse first line of Burp HTTP message
 *
 * @function
 * @param {string} firstLine - firstLine of Burp HTTP message
 * @return {{}} - The method, path, params, httpVersion of Burp HTTP message
 */
export function convertFirstLineBurp(firstLine: string): {
  method: string,
  path: string,
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
  const hash = parsedPath.hash || '';
  return {
    method,
    httpVersion,
    path: (parsedPath.path || '/') + hash,
  };
}

/**
 * Try to parse burp HTTP message to Axios with input delimiter
 *
 * @function
 * @param {string} burp - burp HTTP message
 * @param {string} delimiter - delimiter between lines of HTTP message, could be '\r\n' or '\n' only
 * @param {boolean} force - forcefully parse the message, if set to false it will return when it find something funny
 * @return {AxiosRequest} - The result Axios
 */
function tryParseWithDelimiter(burp: string, delimiter: '\r\n' | '\n', force = false): AxiosRequest {
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

  const { method, path, httpVersion } = convertFirstLineBurp(arr[0]);

  let originHeader = undefined;
  let requestHeaders = {};
  headers.forEach((h) => {
    const delimiter = h.indexOf(': ');
    if (delimiter === -1) return;
    const key = h.slice(0, delimiter);
    const value = h.slice(delimiter + 2);
    if (/^origin$/i.test(key)) originHeader = value;
    requestHeaders = {
      ...requestHeaders,
      [key]: value,
    };
  });

  // Tried my best to get the full URL back, if origin header is specified
  // I did not use host header, because it redacted http and https, which might make the parser go wrong.
  // If you encounter the host header vague case, please handle in your own code outside this parser.
  let finalUrl = path;
  if (originHeader) finalUrl = originHeader + path;

  const req: AxiosRequest = {
    method: method as HttpMethod,
    url: finalUrl,
    body,
    headers: requestHeaders,
    httpVersion,
  };

  return req;
}

/**
 * Try to parse burp HTTP message to Axios
 *
 * @function
 * @param {string} burp - burp HTTP message
 * @return {AxiosRequest} - The result Axios
 */
export function burpToRequest(burp: string): AxiosRequest {
  try {
    const parsedObj = tryParseWithDelimiter(burp, '\r\n');
    return parsedObj;
  } catch (err) {
    const parsedObj = tryParseWithDelimiter(burp, '\n', true);
    return parsedObj;
  }
}
