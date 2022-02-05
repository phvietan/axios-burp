import { AxiosRequestConfig, Method } from "./type";

function convertFirstLineBurp(line: string) {
  const arr = line.split(' ');
  const method = arr[0];

  let lastWhitespace = 10000000;
  for (let i = line.length - 1; i >= 0; --i)
    if (line[i] === ' ') {
      lastWhitespace = i;
      break;
    }

  const path = line.slice(method.length + 1, lastWhitespace);

  return { method, path };
}

function tryParseWithDelimiter(burp: string, delimiter: string, force = false) {
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

  const { method, path } = convertFirstLineBurp(arr[0]);

  const req: AxiosRequestConfig = {};
  req.method = method as Method;
  req.url = path;
  req.data = body;
  req.headers = {};

  headers.forEach(h => {
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

export function burpToRequest(burp: string): AxiosRequestConfig {
  try {
    const parsedObj = tryParseWithDelimiter(burp, '\r\n');
    return parsedObj;
  } catch (err) {
    const parsedObj = tryParseWithDelimiter(burp, '\n', true);
    return parsedObj;
  }
}
