const got = require('got');

/**
 * @param {Buffer} query
 * @param {string} target
 */
function udpwireformat(query, target) {
  return new Promise((resolve, reject) => {
    got.post(target, {
      headers: {
        'content-type': 'application/dns-udpwireformat'
      },
      body: query,
      encoding: null
    }).then(res => {
      resolve(res.body);
    }).catch(err => {
      reject(err);
    });
  });
}


module.exports = udpwireformat;
