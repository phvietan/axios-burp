# Axios-Burp convertor

If you have ever using [Burp](https://portswigger.net/burp), you must have encountered HTTP requests logs (in repeater, intruder, http log, etc), for example:

```
POST /admin HTTP/1.1
Host: test.test.com
Connection: close
Content-Length: 21
Cache-Control: max-age=0
Upgrade-Insecure-Requests: 1
Origin: https://test.test.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
Accept-Encoding: gzip, deflate
Accept-Language: en-US,en;q=0.9,vi;q=0.8

user=admin&pass=admin
```

And if you have ever using [Axios](https://github.com/axios/axios), the following code snippet might look familiar to you:

```typescript
async function example() {
  const opt: AxiosRequestConfig = {
    method: 'GET' as Method,
    params,
    url: `${packet.origin}${packet.path}`,
    data: body,
  }
  const resp = await axios.request(opt);
  // ...
}
```

`axios-burp` is a simple library to convert burp HTTP message to axios request option and vice-versa, with typescript supported.

# Installation

Install with npm:
```sh
npm i axios-burp --save
```
Install with yarn:
```sh
yarn add axios-burp
```

# Using axios-burp

There are only 2 functions exported from `axios-burp`:

## requestToBurp example

```javascript
const { requestToBurp } = require('axios-burp');
const msg = requestToBurp({
  url: '/ayyo/../dcm',
  baseURL: 'https://google.com:3434',
  params: { user: 'admin' },
  data: 'yooo',
}, true);
console.log(msg);
```

This yields
```
GET /ayyo/../dcm?user=admin HTTP/1.1
Host: google.com:3434
Content-Length: 4
Connection: close

yooo
```

## burpToRequest example

```javascript
const { burpToRequest } = require('axios-burp');
const burp =
`OPTIONS /ayyoHTTP/1.1yo?a=1 HTTP/1.1
Test: close
WTF: Test

this is my body`

const obj = burpToRequest(burp);
console.log(obj)
```

This yields
```
{
  method: 'OPTIONS',
  url: '/ayyoHTTP/1.1yo',
  data: 'this is my body',
  params: { a: '1' },
  headers: { Test: 'close', WTF: 'Test' }
}
```

# License

Licensed under [MIT](./LICENSE).

