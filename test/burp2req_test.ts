import chai from 'chai';
import { burpToRequest } from '../src/burp2req';

const assert = chai.assert;

describe('Test burp2req', () => {
  it('should correctly convert burp to axios request', () => {
    const obj = burpToRequest(
        `GET /ayyo/../dcm HTTP/1.1\r\nConnection: close\r\n\r\nyooo`,
    );
    assert(obj.method === 'GET');
    assert(obj.url === '/ayyo/../dcm');
    assert(obj.body === 'yooo');
    assert(obj.headers?.length === 1);
  });
  it('should correctly convert burp to axios request 2', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen? HTTP/2\r\nTest: close\r\nWTF: Test\r\n\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.url === '/ayyoHTTP/1.1%20%20wtfmen?');
    assert(obj.body === 'this is my body');
    assert(obj.httpVersion === 'HTTP/2');
    assert(obj.headers?.length === 2);
  });
  it('should correctly convert burp to axios request 3', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen? HTTP/1.1\r\nTest: close\r\nWTF: Test\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.url === '/ayyoHTTP/1.1%20%20wtfmen?');
    assert(obj.body === undefined);
    assert(obj.headers?.length === 3);
  });
  it('should correctly convert burp to axios request with params', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen?a=3&b=4#123 HTTP/1.1\r\nTest: close\r\nWTF: Test\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.body === undefined);
    assert(obj.url === '/ayyoHTTP/1.1%20%20wtfmen?a=3&b=4#123');
  });
  it('should correctly convert burp to axios request when have origin header', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen?a=3&b=4#123 HTTP/1.1\r\nOrigin: https://test.com\r\nTest: close\r\nWTF: Test\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.body === undefined);
    assert(obj.url === 'https://test.com/ayyoHTTP/1.1%20%20wtfmen?a=3&b=4#123');
  });
});
