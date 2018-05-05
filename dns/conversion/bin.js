/**
 * Converts binary to UTF8.
 * @param {string} bin
 */
function toString(bin) {
  if (!/^[01]*$/.test(bin)) throw new Error('Not binary!');
  if (bin.length % 8 !== 0) throw new Error('Not multiple of 8 bits!');
  return bin.replace(/(.{8})/g, (full, $1) => String.fromCharCode(parseInt($1, 2)));
}

/**
 * Converts 32 bits into a IPv4 address.
 * @param {string} bin A 32 bit IP.
 */
function toIPv4(bin) {
  if (!/^[01]{32}$/.test(bin)) throw new Error('Not 32 bit!');
  return bin.replace(/(.{8})/g, (full, $1) => `${parseInt($1, 2)}.`).replace(/\.$/, '');
}
/**
 * Converts 128 bits into a IPv6 address.
 * @param {string} bin A 128 bit IP.
 */
function toIPv6(bin) {
  if (!/^[01]{128}$/.test(bin)) throw new Error('Not 128 bit!');
  return bin.replace(/(.{16})/g, (m, $1) => `${parseInt($1, 2).toString(16)}:`).replace(/:$/, '').toUpperCase();
}
/**
 * Converts binary into a signed int.
 * @param {string} bin
 * @param {number} bits
 */
function toSignedInt(bin, bits) {
  if (!/^[01]*$/.test(bin)) throw new Error('Not binary!');
  if (bin.length > bits) throw new Error(`Expected ${bits} bit got ${bin.length} bit!`);
  const out = parseInt(bin, 2);
  if (2 ** (bits - 1) <= out) {
    return (out - (2 ** bits)) + 1;
  }
  return out;
}

/**
 * @param {string} bin
 */
function toHex(bin) {
  if (!/^[01]*$/.test(bin)) throw new Error('Not binary!');
  if (bin.length % 4 !== 0) throw new Error('Not multiple of 4 bits!');
  const map = {
    '0000': '0',
    '0001': 1,
    '0010': 2,
    '0011': 3,
    '0100': 4,
    '0101': 5,
    '0110': 6,
    '0111': 7,
    1000: 8,
    1001: 9,
    1010: 'A',
    1011: 'B',
    1100: 'C',
    1101: 'D',
    1110: 'E',
    1111: 'F'
  };
  const out = bin.replace(/.{4}/g, full => map[full]);

  return out;
}

module.exports = {
  toString, toIPv4, toIPv6, toSignedInt, toHex
};
