'use strict';

let Promise       = require('bluebird');
let co            = Promise.coroutine;
let types         = require('./types');
let ModelMapper   = require('./modelMapper');
let pool          = require('./pool');
let wrap          = require('async-class').wrap;

class SQLMagic {
  constructor(opts) {

    let Dialect;

    try {
      Dialect = require(`./dialect/${opts.dialect}`);      
    } catch (e) {
      throw new Error('Invalid dialect: ' + opts.dialect);
    }
    this.dialect = new Dialect();
    this.pool = pool.createPool(opts, this.dialect);

    let mapper = new ModelMapper();
    ['column', 'registerModel'].forEach((key) => {
      this[key] = mapper[key].bind(mapper);
    });

    for (let key in types) {
      this[key] = types[key];
    }
  }

  *execute(query, values) {
    if (typeof query === 'string' && !(values instanceof Array)) {
      console.log('test');
      throw new Error('Expected array of values for prepared statement');
    }

    if (query instanceof Array) {
      // If called as tagged template
      values = [].slice.call(arguments, 1);
    }

    let client = yield this.pool.acquireAsync();
    let res = yield client.executeAsync(query, values);
    this.pool.release(client);
    return res;
  }

  close() {
    this.pool.drain(() => this.pool.destroyAllNow());
  }
}

wrap(SQLMagic, ['execute']);

module.exports = function(opts) {
  return new SQLMagic(opts);
};
