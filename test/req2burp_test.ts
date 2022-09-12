import chai from 'chai';
import { requestToBurp } from '../src/req2burp';

const assert = chai.assert;

describe('Test req2burp', () => {
  it('should correctly convert axios request to burp', () => {
    const msg = requestToBurp({
      url: '/ayyo',
      headers: ['Connection: close'],
      body: 'yooo',
    });
    assert(msg.split('\r\n').length === 4);
  });
  it('should correctly convert axios request to burp when url is full and autoaddheader', () => {
    const msg = requestToBurp({
      url: 'http://google.com/ayyo/../dcm',
      body: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 7);
  });
  it('should correctly convert axios request to burp when url is path and autoaddheader', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      body: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 5);
  });
  it('should correctly convert axios request to burp when have baseURL', () => {
    const msg = requestToBurp({
      url: '/ayyo/../dcm',
      body: 'yooo',
    });
    assert(msg.split('\r\n').length === 3);
  });
  it('should correctly convert axios request to burp when have baseURL and autoaddheader', () => {
    const msg = requestToBurp({
      url: 'https://attacker.com/ayyo/../dcm?wtf=1#aaa=2',
      headers: ['Authorization: Bearer test', 'Cookie: test=test'],
      body: 'yooo',
      httpVersion: 'HTTP/2',
    }, true);
    assert(msg.split('\r\n').length === 9);
  });
});
