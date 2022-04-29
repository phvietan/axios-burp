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
    assert(obj.data === 'yooo');
    assert(obj.headers['Connection'] === 'close');
  });
  it('should correctly convert burp to axios request 2', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen? HTTP/1.1\r\nTest: close\r\nWTF: Test\r\n\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.url === '/ayyoHTTP/1.1%20%20wtfmen');
    assert(obj.data === 'this is my body');
    assert(obj.httpVersion === 'HTTP/1.1');
  });
  it('should correctly convert burp to axios request 3', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen? HTTP/1.1\r\nTest: close\r\nWTF: Test\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.url === '/ayyoHTTP/1.1%20%20wtfmen');
    assert(obj.data === undefined);
  });
  it('should correctly convert burp to axios request with params', () => {
    const obj = burpToRequest(
        `OPTIONS /ayyoHTTP/1.1  wtfmen?a=3&b=4 HTTP/1.1\r\nTest: close\r\nWTF: Test\r\nthis is my body`,
    );
    assert(obj.method === 'OPTIONS');
    assert(obj.data === undefined);
    assert(obj.params.a === '3');
    assert(obj.params.b === '4');
  });
});
