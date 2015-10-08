'use strict';

let expect   = require('chai').expect;
let sqlmagic = require('../../lib/sqlmagic');

describe('initialization', function() {
  it('throws given an invalid dialect', function* () {
    expect(function() {
      sqlmagic({dialect: 'mongodb'});
    }).to.throw(Error);
  });
  it('finds correctly-specified dialect', function () {
    expect(function() {
      sqlmagic({dialect: 'mysql2'});
    }).to.not.throw(Error);
  });
});
