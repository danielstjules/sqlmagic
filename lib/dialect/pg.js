'use strict';

let pg      = require('pg');
let Promise = require('bluebird');
let crypto  = require('crypto');

class PGDialect {
  constructor() {
    this.queryNames = {};
  }

  createClient(config, fn) {
    let client = new pg.Client(config);
    this.patchClient(client);
    client.connect((err) => {
      if (err) return fn(err);
      fn(null, client);
    });
  }

  sql(parts, values) {
    return {
      text: parts.reduce((prev, curr, i) => prev + '$' + i + curr),
      values
    };
  }

  getQueryName(text) {
    if (this.queryNames[text]) {
      return this.queryNames[text];
    }

    let name = crypto.createHash('md5').update(text).digest('hex');
    this.queryNames[text] = name;
    return name;
  }

  parseResponse(res) {
    if (res.rows) {
      return res.rows;
    } else if (res.rowCount) {
      return res.rowCount;
    } else {
      return res;
    }
  }

  patchClient(client) {
    client.executeAsync = (query, values) => {
      if (query instanceof Array) {
        query = this.sql(query, values);
      }

      let text = query.text || query;
      let name = query.name || this.getQueryName(text);
      values = values || query.values || [];

      return new Promise((resolve, reject) => {
        client.query({text, values, name}, (err, res) => {
          if (err) return reject(err);
          resolve(this.parseResponse(res));
        });
      });
    };
  }
}

module.exports = PGDialect;
