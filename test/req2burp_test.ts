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
      url: '/ayyo/../dcm',
      body: 'yooo',
    }, true);
    assert(msg.split('\r\n').length === 5);
  });
});
