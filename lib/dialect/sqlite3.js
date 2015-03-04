'use strict';

let sqlite3 = require('sqlite3');
let Promise = require('bluebird');

class SQLite3Dialect {
  createClient(config, fn) {
    let mode = sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE;
    let client = new sqlite3.Database(config.filename, mode, (err) => {
      if (err) return fn(err);
      this.patchClient(client);
      fn(null, client);
    });
  }

  sql(parts, values) {
    return {
      text: parts.reduce((prev, curr) => prev + '?' + curr),
      values
    };
  }

  patchClient(client) {
    client.executeAsync = (query, values) => {
      if (query instanceof Array) {
        query = this.sql(query, values);
      }

      let text = query.text || query;
      values = values || query.values || [];

      return new Promise((resolve, reject) => {
        client.run(text, values, (err, res) => {
          if (err) return reject(err);
          resolve(res);
        });
      });
    };
  }
}

module.exports = SQLite3Dialect;
