const compression = require('../dns/compression');

console.log(`Test:   ${compression(Buffer.from('0001010000010000000000000131013001300331323707696e2d61646472046172706100000c0001', 'hex'), 12)}`);
console.log('Target: 1.0.0.127.in-addr.arpa.');
