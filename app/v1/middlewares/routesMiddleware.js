const { model_fields } = require('./../settings');

function prePatch ({ body }, res, next, model_name) {
  body = model_fields[model_name].reduce((acc, field) => {
    acc[field] = body[field];
    return acc;
  }, {});
  return next();
}

module.exports = {
  prePatch,
};
