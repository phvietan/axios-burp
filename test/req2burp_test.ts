import chai from 'chai';
import { convertFirstLineBurp } from '../src/burp2req';
import { requestToBurp } from '../src/req2burp';

const assert = chai.assert;

describe('Test req2burp', () => {
  it('should correctly convert axios request to burp', () => {
    const msg = requestToBurp({
      url: '/ayyo',
      headers: {
        'Connection': 'close',
      },
      data: 'yooo',
    });
    assert(msg.split('\r\n').length === 4);
  });
  it('should correctly convert axios request to burp when url is full and autoaddheader', () => {
    const msg = requestToBurp({
      url: 'http://google.com/ayyo/../dcm',
      data: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 6);
  });
  it('should correctly convert axios request to burp when url is path and autoaddheader', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      data: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 5);
  });
  it('should correctly convert axios request to burp when have baseURL', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      baseURL: 'https://google.com:3434',
      data: 'yooo',
    });
    assert(msg.split('\r\n').length === 3);
  });
  it('should correctly convert axios request to burp when have baseURL and autoaddheader', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      baseURL: 'https://google.com',
      data: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 6);
  });
  it('should correctly convert axios request to burp when have params', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      params: { wtf: 'cc', ayto: 'wtf' },
      baseURL: 'https://google.com',
      data: 'yooo',
      httpVersion: 'HTTP/2',
    }, true);
    assert(msg.split('\r\n').length === 6);
    const firstLine = msg.split('\r\n')[0];
    assert(firstLine === 'GET /ayyo/../dcm?wtf=cc&ayto=wtf HTTP/2');
    const obj = convertFirstLineBurp(firstLine);
    assert(obj.httpVersion === 'HTTP/2');
    assert(obj.method === 'GET');
    assert(obj.path === '/ayyo/../dcm');
    assert(Object.keys(obj.params).length === 2);
  });
});

