const {expect} = require('chai');
const {describe, it, before} = require('mocha');


class Polyfills {
  constructor() {}

  init() {
    this.setIsEmpty();
    this.setFilterBy();
    this.setGetClone();
    this.setLog();
    this.setIsString();
  }

  setIsEmpty() {
    if (Object.prototype.isEmpty) return;

    Object.defineProperty(Object.prototype, 'isEmpty', {
      enumerable: false,
      configurable: false,
      /**
       * Проверка объекта на пустоту
       * @return {boolean}
       */
      get() {
        return Object.keys(this).length === 0;
      },
    });

  }

  setFilterBy() {
    if (Object.prototype.filterBy) return;
    Object.defineProperty(Object.prototype, 'filterBy', {
      /**
       * Фильтрация ключей, не входящих в allowedFields
       * @param {Array.<String>|Object} allowedFields
       */
      value: function(allowedFields) {
        let copy;
        if (Array.isArray(allowedFields)) {
          copy = {
            self: allowedFields,
          };
        } else {
          copy = JSON.parse(JSON.stringify(allowedFields));
        }

        for (let field in this) {
          if (!Object.prototype.hasOwnProperty.call(this, field)) continue;
          if (copy.self?.includes(field)) continue;
          if (copy[field]) continue;

          delete this[field];
        }
        delete copy.self;

        for (let nested in copy) {
          if (!Object.prototype.hasOwnProperty.call(copy, nested)) continue;
          Object.prototype.filterBy.call(this[nested], copy[nested]);
        }
      },
    });

  }

  setGetClone() {
    if (Object.prototype.getClone) return;

    Object.defineProperty(Object.prototype, 'getClone', {
      enumerable: false,
      writable: false,
      configurable: false,
      /**
       * Копирует объект (deep copy)
       * @return {any}
       */
      value: function() {
        return JSON.parse(JSON.stringify(this));
      },
    });
  }

  setLog() {
    if (Object.prototype.log) return;

    Object.defineProperty(Object.prototype, 'log', {
      enumerable: false,
      writable: false,
      configurable: false,
      /**
       * Лог объекта в консоль
       * @param {*} replacer
       * @param {Number|String} indent=2
       */
      value: function(replacer = null, indent = 2) {
        console.log(JSON.stringify(this, replacer, indent));
      },
    });
  }

  setIsString() {
    if (String.prototype.isString) return;

    Object.defineProperty(String.prototype, 'isString', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(str) {
        return typeof str === 'string' || str instanceof String;
      },
    });
  }
}


module.exports = new Polyfills();

function test() {
  describe('Polyfills tests', function() {
    before(function() {
      new Polyfills().init();
    });
    describe('isEmpty', function() {
      it('Should return true', function() {
        expect({}.isEmpty).to.be.equal(true);
      });

      it('Should return false', function() {
        expect({test: 'test'}.isEmpty).to.be.equal(false);
      });
    });

    describe('filter', function() {
      before(function() {
        this.plain = {
          _id: '111',
          title: 'test',
          admin: 'admin',
        };
        this.nested = {
          remove: {
            test: 'test',
          },
          stay: {
            stayNested: {
              test: 'test',
              removed: 'removed',
            },
            removed: 'no',
          },
          selfValue: 'self',
          removedSelfValue: 'no',
        };
      });
      it('Should filter plain object', function() {
        let object = this.plain.getClone();
        object.filterBy({
          self: ['title'],
        });

        expect(object).to.be.an('object');
        expect(object).to.have.own.property('title');
        expect(object).to.not.have.own.property('_id');
        expect(object).to.not.have.own.property('admin');
      });

      it('Should filter by array', function() {
        let object = this.plain.getClone();

        object.filterBy(['title']);
        expect(object).to.be.an('object');
        expect(object).to.have.own.property('title');
        expect(object).to.not.have.own.property('_id');
        expect(object).to.not.have.own.property('admin');
      });

      it('Should filter nested object', function() {
        let object = this.nested.getClone();
        object.filterBy({
          self: ['selfValue'],
          stay: {
            stayNested: ['test'],
          },
        });

        object.log();

        expect(object).to.be.an('object');
        expect(object).to.have.own.property('selfValue');
        expect(object).to.have.own.property('stay');
        expect(object).to.not.have.own.property('remove');
        expect(object).to.not.have.own.property('removedSelfValue');
        expect(object.stay).to.have.own.property('stayNested');
        expect(object.stay).to.not.have.own.property('removed');
        expect(object.stay.stayNested).to.have.own.property('test');
        expect(object.stay.stayNested).to.not.have.own.property('removed');
      });
    });

    describe('isString', function() {
      it('Should return true', function() {
        expect(String.prototype.isString('')).to.be.equal(true);
      });

      it('Should return false', function() {
        expect(String.prototype.isString({})).to.be.equal(false);
      });
    });
  });
}
