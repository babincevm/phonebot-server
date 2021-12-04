const CRUD = require('../CRUD');


class Quiz extends CRUD {}


class Survey extends Quiz {}


class Test extends Quiz {}


module.exports = {
  Survey,
  Test,
};
