var _ = require('lodash');

function ModelMapper() {
  this.models = new Set();
  this.modelConfigMap = new Map();
}

const columnFlag = '_sqlmagicColumn';

module.exports = ModelMapper;

ModelMapper.prototype.column = function column(config) {
  var model = column.caller;

  // The column belongs to a registered model
  if (this.models.has(model)) {
    return config.init || null;
  }

  Object.defineProperty(config, columnFlag, {
    enumerable: false,
    writable: true
  });

  config[columnFlag] = true;

  return config;
};

ModelMapper.prototype.registerModel = function(model, config) {
  var instance, key, columns;

  if (!config.table) {
    throw new Error('registerModel requires a table key in the config object');
  }

  if (this.models.has(model)) {
    throw new Error('model has already been registered');
  }

  instance = new model();

  columns = {};
  for (key in instance) {
    if (!instance[key][columnFlag]) continue;

    columns[key] = _.cloneDeep(instance[key]);
    delete columns[key].init;
  }

  this.models.add(model);
  this.modelConfigMap.set(model, {
    table:   config.table,
    columns: columns
  });
};
