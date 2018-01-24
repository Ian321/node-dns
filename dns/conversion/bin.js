/**
 * Converts binary to UTF8.
 * @param {string} bin
 */
function toString(bin) {
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
  return bin.replace(/(.{16})/g, (m, $1) => `${parseInt($1, 2).toString(16)}:`).replace(/:$/, '').toUpperCase();
}

module.exports = { toString, toIPv4, toIPv6 };
