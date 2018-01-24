const { bin } = require('../conversion');
const compression = require('./compression');

module.exports = {
  A: RDATA => ({ ADDRESS: bin.toIPv4(RDATA) }),
  NS: RDATA => RDATA,
  CNAME: (RDATA, FULL) => {
    let pkg = RDATA;
    // const LENGTH = parseInt(pkg.match(/^.{16}/), 2);
    // pkg = pkg.replace(/^.{16}/, '');
    let CNAME = '';
    /* <PARSE BLOCK> */
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

        CNAME += compression(FULL, pnt);
        break;
      } else {
        pkg = pkg.replace(/^.{8}/, '');
      }

      while (e > 0) {
        CNAME += bin.toString(pkg.match(/^.{8}/)[0]);
        pkg = pkg.replace(/^.{8}/, '');
        e--;
      }
      CNAME += '.';
    }
    /* </PARSE BLOCK> */
    return { CNAME };
  },
  SOA: RDATA => RDATA,
  WKS: RDATA => RDATA,
  PTR: RDATA => RDATA,
  HINFO: RDATA => RDATA,
  MINFO: RDATA => RDATA,
  MX: (RDATA, FULL) => {
    let pkg = RDATA;
    const PREFERENCE = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
    let EXCHANGE = '';
    /* <PARSE BLOCK> */
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

        EXCHANGE += compression(FULL, pnt);
        break;
      } else {
        pkg = pkg.replace(/^.{8}/, '');
      }

      while (e > 0) {
        EXCHANGE += bin.toString(pkg.match(/^.{8}/)[0]);
        pkg = pkg.replace(/^.{8}/, '');
        e--;
      }
      EXCHANGE += '.';
    }
    /* </PARSE BLOCK> */
    return { PREFERENCE, EXCHANGE };
  },
  TXT: RDATA => {
    let pkg = RDATA;
    const LENGTH = parseInt(pkg.match(/^.{8}/), 2);
    pkg = pkg.replace(/^.{8}/, '');
    const DATA = bin.toString(pkg);
    return { LENGTH, DATA };
  },
  RP: RDATA => RDATA,
  AFSDB: RDATA => RDATA,
  SIG: RDATA => RDATA,
  KEY: RDATA => RDATA,
  AAAA: RDATA => ({ ADDRESS: bin.toIPv6(RDATA) }),
  LOC: RDATA => RDATA,
  SRV: RDATA => RDATA,
  NAPTR: RDATA => RDATA,
  KX: RDATA => RDATA,
  CERT: RDATA => RDATA,
  DNAME: RDATA => RDATA,
  APL: RDATA => RDATA,
  DS: RDATA => RDATA,
  SSHFP: RDATA => RDATA,
  IPSECKEY: RDATA => RDATA,
  RRSIG: RDATA => RDATA,
  NSEC: RDATA => RDATA,
  DNSKEY: RDATA => RDATA,
  DHCID: RDATA => RDATA,
  NSEC3: RDATA => RDATA,
  NSEC3PARAM: RDATA => RDATA,
  TLSA: RDATA => RDATA,
  HIP: RDATA => RDATA,
  CDS: RDATA => RDATA,
  CDNSKEY: RDATA => RDATA,
  OPENPGPKEY: RDATA => RDATA,
  TKEY: RDATA => RDATA,
  TSIG: RDATA => RDATA,
  URI: RDATA => RDATA,
  CAA: RDATA => RDATA,
  TA: RDATA => RDATA,
  DLV: RDATA => RDATA,
  OPT: RDATA => RDATA,
  IXFR: RDATA => RDATA,
  AXFR: RDATA => RDATA,
  /*                     */
  '*': RDATA => RDATA,
  undefined: RDATA => RDATA
};
