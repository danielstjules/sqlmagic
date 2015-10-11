'use strict';

let mysql   = require('mysql2');
let Promise = require('bluebird');

class MySQL2Dialect {
  createClient(config, fn) {
    let client = mysql.createConnection(config);
    this.patchClient(client);
    fn(null, client);
  }

  sql(parts, values) {
    return {
      text: parts.reduce((prev, curr) => prev + '?' + curr),
      values
    };
  }

  parseResponse(res) {
    return {
      count: res.length,
      rows:  res
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
        client.execute(text, values, (err, res) => {
          if (err) {
            let msg = err.message + '\nQuery:' + query + '\nValues:' + values;
            return reject(new Error(msg));
          }
          resolve(this.parseResponse(res));
        });
      });
    };
  }
}

module.exports = MySQL2Dialect;
