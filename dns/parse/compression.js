const { hex, bin } = require('../conversion');

/**
 * @param {Buffer} fullRequest
 * @param {number} pnt Pointer
 */
function parseCompression(fullRequest, pnt) {
  if (!pnt) throw new Error('Missing pointer');

  let tmp = hex.toBin(fullRequest.toString('hex'), 16).match(new RegExp(`.{${pnt * 8}}(.*)00000000`))[1];

  let out = '';
  while (true) { // eslint-disable-line no-constant-condition
    let e = parseInt(tmp.match(/^.{8}/), 2);
    if (e === 0) {
      tmp = tmp.replace(/^.{8}/, '');
      break;
    }

    if (parseInt(tmp.match(/^.{2}/), 2) === 0b11) {
      tmp = tmp.replace(/^.{2}/, '');
      const pnt2 = parseInt(tmp.match(/^.{14}/), 2);
      tmp = tmp.replace(/^.{14}/, '');

      out += parseCompression(fullRequest, pnt2);
      tmp = tmp.replace(/^.{16}/, '');
      if (parseInt(tmp.match(/^.{8}/), 2) === 0) {
        break;
      }
    } else {
      tmp = tmp.replace(/^.{8}/, '');
    }

    while (e > 0) {
      out += bin.toString(tmp.match(/^.{8}/)[0]);
      tmp = tmp.replace(/^.{8}/, '');
      e--;
    }
    out += '.';
  }
  return out;
}


module.exports = parseCompression;
