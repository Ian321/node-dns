/* eslint-disable no-case-declarations */

const { bin } = require('../conversion');
const compression = require('./compression');

/**
 * @param {string} type Data type (A, NS, CNAME, ...)
 * @param {string} RDATA The RDATA
 * @param {Buffer} FULL The entire message for decompression
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
      return RDATA;
    case 'CNAME':
      return { CNAME: parseCompression() };
    case 'SOA':
    case 'WKS':
    case 'PTR':
    case 'HINFO':
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
      const DATA = bin.toString(pkg);
      return { LENGTH, DATA };
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
