const dgram = require('dgram');
const net = require('net');
const { parse, conversion: { hex } } = require('./index');

const server = dgram.createSocket('udp4');
const server2 = net.createServer(c => {
  c.on('end', () => {});
  /**
   * If the server needs to close a dormant connection to reclaim
   * resources, it should wait until the connection has been idle
   * for a period on the order of two minutes.
  */
  let timeout = setTimeout(() => {
    c.end();
  }, 1000 * 60 * 2);
  let msg = '';
  let l = -1;
  c.on('data', data => {
    let pkg = hex.toBin(data.toString('hex'), 16);
    if (l === -1) {
    /**
     * Messages sent over TCP connections use server port 53 (decimal).  The
     * message is prefixed with a two byte length field which gives the message
     * length, excluding the two byte length field.  This length field allows
     * the low-level processing to assemble a complete message before beginning
     * to parse it.
     */
      l = parseInt(pkg.match(/^.{2}/), 2);
      pkg = pkg.replace(/^.{2}/, '');
    }
    msg += pkg;
    if (l === 0 || msg.length === l) {
      console.log(`server got: '${JSON.stringify(parse(msg).QUESTIONS)}' from ${c.address().address}:${c.address().port}`);
      l = -1;
      msg = '';
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      c.end();
    }, 1000 * 60 * 2);
  });
});

server.on('error', err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});
server2.on('error', err => {
  console.log(`server error:\n${err.stack}`);
  server2.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: '${JSON.stringify(parse(msg).QUESTIONS)}' from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(53);
server2.listen(53);
