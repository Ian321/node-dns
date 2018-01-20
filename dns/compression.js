const { hexToBin, binToString } = require('../lib');
/**
 * @param {Buffer} fullRequest
 * @param {number} pnt Pointer
 */
function parseCompression(fullRequest, pnt) {
  if (!pnt) throw new Error('Missing pointer');

  let tmp = hexToBin(fullRequest.toString('hex'), 16).match(new RegExp(`.{${pnt * 8}}(.*)00000000`))[1];

  let out = '';
  while (true) { // eslint-disable-line no-constant-condition
    let e = parseInt(tmp.match(/^.{8}/), 2);
    tmp = tmp.replace(tmp.match(/^.{8}/), '');
    if (e === 0) {
      break;
    }
    while (e > 0) {
      out += binToString(tmp.match(/^.{8}/));
      tmp = tmp.replace(tmp.match(/^.{8}/), '');
      e--;
    }
    out += '.';
  }
  return out;
}


module.exports = parseCompression;
