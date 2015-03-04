'use strict';

let genericPool = require('generic-pool');
let Promise     = require('bluebird');

exports.createPool = function createPool(config, dialect) {
  if (!dialect) {
    throw new Error('Missing dialect for connection pool');
  }

  return Promise.promisifyAll(genericPool.Pool({
    name: `${config.dialect}:${config.host}:${config.database}`,
    min: config.min || 2,
    max: config.max || 20,
    idleTimeoutMillis: config.idle || 60000,
    log: false,
    create: (fn) => dialect.createClient(config, fn),
    destroy: (client) => client.end()
  }));
};
