# Axios-Burp convertor

If you have ever using [Burp](https://portswigger.net/burp), you must have encountered HTTP requests logs (in repeater, intruder, http log, etc), for example:

```
POST /admin HTTP/1.1
Host: test.test.com
Connection: close
Content-Length: 21
Cache-Control: max-age=0
sec-ch-ua: " Not;A Brand";v="99", "Google Chrome";v="97", "Chromium";v="97"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Windows"
Upgrade-Insecure-Requests: 1
Origin: https://test.test.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Sec-Fetch-Site: same-origin
Sec-Fetch-Mode: navigate
Sec-Fetch-User: ?1
Sec-Fetch-Dest: document
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

# Installation

Simple installation through npm:

```bash
npm i --save axios-burp
```

# Using axios-burp

There are 2 functions exported from the package:

## requestToBurp

You can try running the following code snippet:

```javascript
const { requestToBurp } = require('axios-burp');
const msg = requestToBurp({
  url: '/ayyo/../dcm',
  baseURL: 'https://google.com:3434',
  params: { user: 'admin' },
  data: 'yooo',
});
console.log(msg);
```

This yields
```
GET /ayyo/../dcm?user=admin HTTP/1.1\r\n
Host: google.com:3434\r\n
\r\n
yooo
```

## burpToRequest

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
TODO
```

