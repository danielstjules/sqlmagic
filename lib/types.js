var _ = require('lodash');

var types = module.exports = {};

types.varchar = function VARCHAR(length) {
  this.length = length || 255;
  this.default = '';
};

types.char = function CHAR(length) {
  this.length = length || 255;
  this.default = '';
};

types.text = function TEXT() {
  this.default = '';
};

types.smallint = function SMALLINT() {
  this.min = -32768;
  this.max = 32767;
  this.default = 0;
};

types.integer = function INTEGER() {
  this.min = -2147483648;
  this.max = 2147483647;
  this.default = 0;
};

types.bigint = function BIGINT() {
  this.min = -9223372036854775808;
  this.max = 9223372036854775807;
  this.default = 0;
};

types.decimal = function DECIMAL(precision, scale) {
  this.precision = precision;
  this.scale = scale;
  this.default = 0.0;
};

types.numeric = function NUMERIC(precision, scale) {
  this.precision = precision;
  this.scale = scale;
  this.default = 0.0;
};

types.float = function FLOAT(length, decimals) {
  this.length = length;
  this.decimals = decimals;
  this.default = 0.0;
};

types.real = function REAL(length, decimals) {
  this.length = length;
  this.decimals = decimals;
  this.default = 0.0;
};

types.double = function DOUBLE(length, decimals) {
  this.length = length;
  this.decimals = decimals;
  this.default = 0.0;
};

types.boolean = function BOOLEAN() {
  this.default = false;
};

types.date = function DATE() {};

types.time = function TIME() {};

types.timestamp = function TIMESTAMP() {};

types.enum = function ENUM(args) {
  this.types = Array.prototype.slice.call(arguments);
}
