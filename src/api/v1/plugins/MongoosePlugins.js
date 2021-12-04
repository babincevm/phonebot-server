const {deepLog} = require('./../helpers/functions');


class MongoosePlugins {
  setFilteredToObject(schema) {
    if (!schema.options.toObject) schema.options.toObject = {};
    schema.options.toObject.transform = function(doc, ret, {roleAccess}) {
      if (!roleAccess) return ret;

      Object.prototype.filterBy.call(ret, roleAccess);
      return ret;
    };
  }

  setToObjectOptions(schema) {
    schema.statics.setToObjectRoleAccess = function(access) {
      schema.options.toObject.roleAccess = access;
    };
  }
}


module.exports = new MongoosePlugins();
