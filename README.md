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
    url: `${packet.origin}${packet.path}`,
    data: body,
  }
  const resp = await axios.request(opt);
  // ...
}
```

`axios-burp` is a simple library to convert burp HTTP message to axios request option and vice-versa.

However, to keep the logic simple, `axios-burp` re-define `AxiosRequest` type, please see <a href="#usage">Usage</a> below.

# Installation

Install with npm:
```sh
npm i axios-burp --save
```
Install with yarn:
```sh
yarn add axios-burp
```

# Usage

First, let's define type of `AxiosRequest`.

```typescript
interface AxiosRequest {
  url: string;
  httpVersion?: string;
  method?: HttpMethod;
  headers?: string[];
  body?: string;
}
```

| Property        | Description               | Type  | Required
| :------------- |:-------------:             | :-----:| :-----:|
| url            | The full url or only path  | string | ✔️ |
| httpVersion    | The http version (Default "HTTP/1.1") | string |    |
| method        |  The http method (Default "GET")     |  string |  |
| headers        |  The http headers (Default [])     |  string[] |  |
| body        |  The http body (Default "")    |   string |     |

<br>

### `requestToBurp(req: AxiosRequest [, autoAddHeader: boolean])`


This function parses `AxiosRequest` to Burp-like HTTP msg string. Passing `autoAddHeader=true` results in adding `Origin` header and `Host` header. However, if `AxiosRequest` already contains `Origin` or `Host` headers, the result will priority `AxiosRequest` more.

```javascript
const { requestToBurp } = require('axios-burp');
const msg = requestToBurp({
  url: 'https://google.com:3434/ayyo/../dcm',
  body: 'yooo',
}, true);
console.log(msg);
```


Returns:
```
GET /ayyo/../dcm HTTP/1.1
Host: google.com:3434
Origin: https://google.com:3434
Content-Length: 4
Connection: close

yooo
```

### `burpToRequest(burp: string)`

This function parses HTTP msg string to `AxiosRequest`. If there is `Origin` header presented, the result `url` will be the full url; or else the result `url` only contains the path.

This function tries to parse using `\r\n` first, if failed it will parse using `\n` .

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

returns
```
{
  method: 'OPTIONS',
  url: '/ayyoHTTP/1.1yo?a=1',
  body: 'this is my body',
  headers: [ 'Test: close', 'WTF: Test' ],
  httpVersion: 'HTTP/1.1'
}
```

# License

The project is released under the [MIT license](./LICENSE).

# Credits

[phvietan](https://github.com/phvietan)
