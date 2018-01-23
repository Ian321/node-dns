const { hexToBin, binToString } = require('../lib');
const typemap = require('./typemap');
const compression = require('./parse/compression');
const RR = require('./parse/RR');

/**
 * Parses a DNS package
 * @param {Buffer} dns
 */
function parse(dns) {
  let pkg = hexToBin(dns.toString('hex'), 16);
  const HEADER = {};
  const QUESTIONS = [];
  const ANSWERS = [];
  (function header() {
    /**
     * A 16 bit identifier assigned by the program that
     * generates any kind of query.  This identifier is copied
     * the corresponding reply and can be used by the requester
     * to match up replies to outstanding queries.
     */
    HEADER.ID = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
    /**
     * A one bit field that specifies whether this message is a
     * query (0), or a response (1).
     */
    HEADER.QR = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * A four bit field that specifies kind of query in this
     * message.  This value is set by the originator of a query
     * and copied into the response.  The values are:
     *
     * 0               a standard query (QUERY)
     *
     * 1               an inverse query (IQUERY)
     *
     * 2               a server status request (STATUS)
     *
     * 3-15            reserved for future use
     */
    HEADER.OPCODE = parseInt(pkg.match(/^.{4}/), 2);
    pkg = pkg.replace(/^.{4}/, '');
    /**
     * Authoritative Answer - this bit is valid in responses,
     * and specifies that the responding name server is an
     * authority for the domain name in question section.
     *
     * Note that the contents of the answer section may have
     * multiple owner names because of aliases.  The AA bit
     * corresponds to the name which matches the query name, or
     * the first owner name in the answer section.
     */
    HEADER.AA = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * TrunCation - specifies that this message was truncated
     * due to length greater than that permitted on the
     * transmission channel.
     */
    HEADER.TC = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * Recursion Desired - this bit may be set in a query and
     * is copied into the response.  If RD is set, it directs
     * the name server to pursue the query recursively.
     * Recursive query support is optional.
     */
    HEADER.RD = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * Recursion Available - this be is set or cleared in a
     * response, and denotes whether recursive query support is
     * available in the name server.
     */
    HEADER.RA = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * Reserved for future use.  Must be zero in all queries
     * and responses.
     */
    HEADER.Z = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * The AD (authentic data) bit indicates in a response
     * that the data included has been verified by the server
     * providing it.
     */
    HEADER.AD = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * The CD (checking disabled) bit indicates in a query
     * that non-verified data is acceptable to the resolver
     * sending the query.
     */
    HEADER.CD = parseInt(pkg.match(/^.{1}/), 2);
    pkg = pkg.replace(/^.{1}/, '');
    /**
     * Response code - this 4 bit field is set as part of
     * responses.  The values have the following
     * interpretation:
     *
     * 0               No error condition
     *
     * 1               Format error - The name server was
     *                 unable to interpret the query.
     *
     * 2               Server failure - The name server was
     *                 unable to process this query due to a
     *                 problem with the name server.
     *
     * 3               Name Error - Meaningful only for
     *                 responses from an authoritative name
     *                 server, this code signifies that the
     *                 domain name referenced in the query does
     *                 not exist.
     *
     * 4               Not Implemented - The name server does
     *                 not support the requested kind of query.
     *
     * 5               Refused - The name server refuses to
     *                 perform the specified operation for
     *                 policy reasons.  For example, a name
     *                 server may not wish to provide the
     *                 information to the particular requester,
     *                 or a name server may not wish to perform
     *                 a particular operation (e.g., zone
     *                 transfer) for particular data.
     *
     * 6-15            Reserved for future use.
     */
    HEADER.RCODE = parseInt(pkg.match(/^.{4}/), 2);
    pkg = pkg.replace(/^.{4}/, '');
    /**
     * An unsigned 16 bit integer specifying the number of
     * entries in the question section.
     */
    HEADER.QDCOUNT = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
    /**
     * An unsigned 16 bit integer specifying the number of
     * resource records in the answer section.
     */
    HEADER.ANCOUNT = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
    /**
     * An unsigned 16 bit integer specifying the number of name
     * server resource records in the authority records
     * section.
     */
    HEADER.NSCOUNT = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
    /**
     * An unsigned 16 bit integer specifying the number of
     * resource records in the additional records section.
     */
    HEADER.ARCOUNT = parseInt(pkg.match(/^.{16}/), 2);
    pkg = pkg.replace(/^.{16}/, '');
  }());
  (function questions() {
    for (let i = 0; i < HEADER.QDCOUNT; i++) {
      const q = {};
      /**
       * A domain name represented as a sequence of labels, where
       * each label consists of a length octet followed by that
       * number of octets.  The domain name terminates with the
       * zero length octet for the null label of the root.  Note
       * that this field may be an odd number of octets; no
       * padding is used.
       */
      q.QNAME = '';
      while (true) { // eslint-disable-line no-constant-condition
        let e = parseInt(pkg.match(/^.{8}/), 2);
        if (e === 0) {
          pkg = pkg.replace(/^.{8}/, '');
          break;
        }

        /**
         * Message compression
         */
        if (parseInt(pkg.match(/^.{2}/), 2) === 0b11) {
          pkg = pkg.replace(/^.{2}/, '');
          const pnt = parseInt(pkg.match(/^.{14}/), 2);
          pkg = pkg.replace(/^.{14}/, '');

          q.QNAME += compression(dns, pnt);
          break;
        } else {
          pkg = pkg.replace(/^.{8}/, '');
        }

        while (e > 0) {
          q.QNAME += binToString(pkg.match(/^.{8}/));
          pkg = pkg.replace(/^.{8}/, '');
          e--;
        }
        q.QNAME += '.';
      }
      /**
       * A two octet code which specifies the type of the query.
       * The values for this field include all codes valid for a
       * TYPE field, together with some more general codes which
       * can match more than one type of RR.
       */
      q.QTYPE = typemap.QTYPE[parseInt(pkg.match(/^.{16}/), 2)];
      pkg = pkg.replace(/^.{16}/, '');
      /**
       * A two octet code that specifies the class of the query.
       * For example, the QCLASS field is IN for the Internet.
       */
      q.QCLASS = typemap.QCLASS[parseInt(pkg.match(/^.{16}/), 2)];
      pkg = pkg.replace(/^.{16}/, '');

      QUESTIONS.push(q);
    }
  }());
  (function answers() {
    if (!HEADER.ANCOUNT) return;
    for (let i = 0; i < HEADER.ANCOUNT; i++) {
      const a = {};
      /**
       * A domain name to which this resource record pertains.
       */
      a.NAME = '';
      while (true) { // eslint-disable-line no-constant-condition
        if (pkg.length === 0) {
          console.error(a);
          throw new Error('Parsing error');
        }
        let e = parseInt(pkg.match(/^.{8}/), 2);
        if (e === 0) {
          break;
        }

        /**
         * Message compression
         */
        if (parseInt(pkg.match(/^.{2}/), 2) === 0b11) {
          pkg = pkg.replace(/^.{2}/, '');
          const pnt = parseInt(pkg.match(/^.{14}/), 2);
          pkg = pkg.replace(/^.{14}/, '');

          a.NAME += compression(dns, pnt);
          break;
        } else {
          pkg = pkg.replace(/^.{8}/, '');
        }

        while (e > 0) {
          a.NAME += binToString(pkg.match(/^.{8}/));
          pkg = pkg.replace(/^.{8}/, '');
          e--;
        }
        a.NAME += '.';
      }
      /**
       * Two octets containing one of the RR type codes.  This
       * field specifies the meaning of the data in the RDATA
       * field.
       */
      a.TYPE = typemap.QTYPE[parseInt(pkg.match(/^.{16}/), 2)];
      pkg = pkg.replace(/^.{16}/, '');
      /**
       * Two octets which specify the class of the data in the
       * RDATA field.
       */
      a.CLASS = typemap.QCLASS[parseInt(pkg.match(/^.{16}/), 2)];
      pkg = pkg.replace(/^.{16}/, '');
      /**
       * A 32 bit unsigned integer that specifies the time
       * interval (in seconds) that the resource record may be
       * cached before it should be discarded.  Zero values are
       * interpreted to mean that the RR can only be used for the
       * transaction in progress, and should not be cached.
       */
      a.TTL = parseInt(pkg.match(/^.{32}/), 2);
      pkg = pkg.replace(/^.{32}/, '');
      /**
       * An unsigned 16 bit integer that specifies the length in
       * octets of the RDATA field.
       */
      a.RDLENGTH = parseInt(pkg.match(/^.{16}/), 2);
      pkg = pkg.replace(/^.{16}/, '');
      /**
       * A variable length string of octets that describes the
       * resource.  The format of this information varies
       * according to the TYPE and CLASS of the resource record.
       */
      const RDATArx = new RegExp(`^.{${a.RDLENGTH * 8}}`);
      const _RDATA = pkg.match(RDATArx)[0]; // eslint-disable-line prefer-destructuring
      pkg = pkg.replace(RDATArx, '');
      a.RDATA = RR[RR[a.TYPE] ? a.TYPE : 'undefined'](_RDATA);
      ANSWERS.push(a);
    }
  }());
  return { HEADER, QUESTIONS, ANSWERS };
}

module.exports = parse;
