'use strict';

let expect   = require('chai').expect;
let sqlmagic = require('../../lib/sqlmagic');

describe('initialization', function() {
  it('throws given an invalid dialect', function* () {
    expect(function() {
      sqlmagic({dialect: 'mongodb'});
    }).to.throw(Error);
  });
});
