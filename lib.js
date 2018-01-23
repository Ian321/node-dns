/**
 * @param {string} hexaString
 */
function hexToBin(hexaString) {
  const mapping = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    a: '1010',
    b: '1011',
    c: '1100',
    d: '1101',
    e: '1110',
    f: '1111',
    A: '1010',
    B: '1011',
    C: '1100',
    D: '1101',
    E: '1110',
    F: '1111'
  };
  let bitmaps = '';
  for (let i = 0; i < hexaString.length; i++) {
    bitmaps += mapping[hexaString[i]];
  }

  return bitmaps;
}
/**
 * @param {string} bin
 */
function binToString(bin) {
  return Buffer.from(parseInt(bin, 2).toString(16), 'hex').toString();
}

/**
 * Converts 32 bits into a IPv4 address.
 * @param {string} bin A 32 bit Internet address.
 */
function binToIPv4(bin) {
  if (!/^[01]{32}$/.test(bin)) throw new Error('Not 32 bit!');
  const out = bin.replace(/(.{8})/g, (full, $1) => `${parseInt($1, 2)}.`);
  return out.replace(/\.$/, '');
}

module.exports = { hexToBin, binToString, binToIPv4 };
