/* eslint-disable no-case-declarations, object-curly-newline */

const { bin } = require('../conversion');
const compression = require('./compression');

/**
 * @param {string} type Data type (A, NS, CNAME, ...)
 * @param {string} RDATA The RDATA
 * @param {Buffer|string} FULL The entire message for decompression
 */
function RR(type, RDATA, FULL) {
  let pkg = RDATA;

  function parseCompression() {
    let out = '';
    while (true) { // eslint-disable-line no-constant-condition
      if (pkg.length === 0) {
        throw new Error('Parsing error');
      }
      let e = parseInt(pkg.match(/^.{8}/), 2);
      if (e === 0) {
        break;
      }

      /**
       * Message decompression
       */
      if (parseInt(pkg.match(/^.{2}/), 2) === 0b11) {
        pkg = pkg.replace(/^.{2}/, '');
        const pnt = parseInt(pkg.match(/^.{14}/), 2);
        pkg = pkg.replace(/^.{14}/, '');

        out += compression(FULL, pnt);
        break;
      } else {
        pkg = pkg.replace(/^.{8}/, '');
      }

      while (e > 0) {
        out += bin.toString(pkg.match(/^.{8}/)[0]);
        pkg = pkg.replace(/^.{8}/, '');
        e--;
      }
      out += '.';
    }
    return out;
  }

  switch (type) {
    case 'A':
      return { ADDRESS: bin.toIPv4(RDATA) };
    case 'NS':
      return { NSDNAME: parseCompression() };
    case 'CNAME':
      return { CNAME: parseCompression() };
    case 'SOA':
      const MNAME = parseCompression();
      const RNAME = parseCompression();
      const SERIAL = parseInt(pkg.match(/^.{32}/), 2);
      pkg = pkg.replace(/^.{32}/, '');
      const REFRESH = bin.toSignedInt(pkg.match(/^.{32}/)[0], 32);
      pkg = pkg.replace(/^.{32}/, '');
      const RETRY = bin.toSignedInt(pkg.match(/^.{32}/)[0], 32);
      pkg = pkg.replace(/^.{32}/, '');
      const EXPIRE = bin.toSignedInt(pkg.match(/^.{32}/)[0], 32);
      pkg = pkg.replace(/^.{32}/, '');
      const MINIMUM = parseInt(pkg.match(/^.{32}/), 2);
      pkg = pkg.replace(/^.{32}/, '');
      return { MNAME, RNAME, SERIAL, REFRESH, RETRY, EXPIRE, MINIMUM };
    case 'WKS':
      return RDATA;
    case 'PTR':
      return { PTRDNAME: parseCompression() };
    case 'HINFO':
      const cpuLength = parseInt(pkg.match(/^.{8}/), 2);
      pkg = pkg.replace(/^.{8}/, '');
      const CPUrx = new RegExp(`^.{${cpuLength * 8}}`);
      const CPU = bin.toString(pkg.match(CPUrx)[0]);
      pkg = pkg.replace(CPUrx, '');

      const osLength = parseInt(pkg.match(/^.{8}/), 2);
      pkg = pkg.replace(/^.{8}/, '');
      const OSrx = new RegExp(`^.{${osLength * 8}}`);
      const OS = bin.toString(pkg.match(OSrx)[0]);
      pkg = pkg.replace(OSrx, '');

      return { cpuLength, CPU, osLength, OS };
    case 'MINFO':
      return RDATA;
    case 'MX':
      const PREFERENCE = parseInt(pkg.match(/^.{16}/), 2);
      pkg = pkg.replace(/^.{16}/, '');
      const EXCHANGE = parseCompression();
      return { PREFERENCE, EXCHANGE };
    case 'TXT':
      const LENGTH = parseInt(pkg.match(/^.{8}/), 2);
      pkg = pkg.replace(/^.{8}/, '');
      const TXT = bin.toString(pkg);
      return { LENGTH, TXT };
    case 'RP':
    case 'AFSDB':
    case 'SIG':
    case 'KEY':
      return RDATA;
    case 'AAAA':
      return { ADDRESS: bin.toIPv6(RDATA) };
    case 'LOC':
    case 'SRV':
    case 'NAPTR':
    case 'KX':
    case 'CERT':
    case 'DNAME':
    case 'APL':
    case 'DS':
    case 'SSHFP':
    case 'IPSECKEY':
    case 'RRSIG':
    case 'NSEC':
    case 'DNSKEY':
    case 'DHCID':
    case 'NSEC3':
    case 'NSEC3PARAM':
    case 'TLSA':
    case 'HIP':
    case 'CDS':
    case 'CDNSKEY':
    case 'OPENPGPKEY':
    case 'TKEY':
    case 'TSIG':
    case 'URI':
    case 'CAA':
    case 'TA':
    case 'DLV':
    case 'OPT':
    case 'IXFR':
    case 'AXFR':
      return RDATA;
    // Non-Parsable
    case '*':
    case 'undefined':
    default:
      return RDATA;
  }
}

module.exports = RR;
