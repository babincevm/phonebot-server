const {expect} = require('chai');
const {describe, it, before} = require('mocha');


class Polyfills {
  constructor() {}

  init() {
    this.
      setIsEmpty().
      setFilterBy().
      setGetClone().
      setLog().
      setIsString().
      setHasProperty().
      setGetFlatten().
      setIsObject();
  }

  has(target, propName) {
    return Object.prototype.hasOwnProperty.call(target, propName);
  }

  /**
   * Проверяет, что у таргета нет указанного свойства,
   * и если его нет, то устанавливает
   *
   * @param {String} propName - название свойства
   * @param {Object} attributes - аттрибуты для передачи в функцию
   *   defineProperty
   * @param {any} target=Object.prototype - Объект, которому добавляется
   * свойство
   * @return true - свойство установлено
   * @return false - Свойство с указанным названием уже есть в таргете
   * @return false - Не передано название свойства
   * @return false - Не переданы аттрибуты
   */
  checkAndDefine(
    propName = null, attributes = null, target = Object.prototype) {
    if (this.has(target, propName)) return false;

    if (!propName) return false;
    if (!attributes) return false;

    Object.defineProperty(target, propName, attributes);
    return true;
  }

  /**
   * Добавляет к прототипу объекта свойство hasProperty
   * Проверяет, что у указаннго объекта есть свойство с переданным названием
   */
  setHasProperty() {
    this.checkAndDefine('hasProperty', {
      enumerable: false,
      configurable: false,
      value: function(name) {
        return Object.prototype.hasOwnProperty.call(this, name);
      },
    });

    return this;
  }

  /**
   * Проверяет объект на пустоту
   */
  setIsEmpty() {
    this.checkAndDefine('isEmpty', {
      enumerable: false,
      configurable: false,
      get() {
        return Object.keys(this).length === 0;
      },
    });

    return this;
  }

  /**
   * Фильтрация ключей, не входящих в allowedFields
   */
  setFilterBy() {
    let self = this;
    this.checkAndDefine('filterBy', {
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
          if (!self.has(this, field)) continue;
          if (copy.self?.includes(field)) continue;
          if (copy[field]) continue;

          delete this[field];
        }
        delete copy.self;

        for (let nested in copy) {
          if (!self.has(copy, nested)) continue;
          Object.prototype.filterBy.call(this[nested], copy[nested]);
        }
      },
    });

    return this;
  }

  /**
   * Копирует объект (deep copy)
   */
  setGetClone() {
    this.checkAndDefine('getClone', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function() {
        return JSON.parse(JSON.stringify(this));
      },
    });

    return this;
  }

  /**
   * Лог объекта в консоль
   */
  setLog() {
    this.checkAndDefine('log', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function(replacer = null, indent = 2) {
        console.log(JSON.stringify(this, replacer, indent));
      },
    });

    return this;
  }

  /**
   * Проверка, является ли объект строкойЈ
   */
  setIsString() {
    this.checkAndDefine('isString', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: function(str) {
        return typeof str === 'string' || str instanceof String;
      },
    }, String.prototype);

    return this;
  }

  /**
   * Получение плоского объекта из вложенного
   */
  setGetFlatten() {
    let self = this;
    this.checkAndDefine('getFlatten', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function() {
        let flattened = {};
        for (const i in this) {
          if (!self.has(this, i)) continue;

          if ((typeof this[i]) === 'object' && !Array.isArray(this[i])) {
            let nested = Object.prototype.getFlatten.call(this[i]);
            for (const j in nested) {
              flattened[i + '.' + j] = nested[j];
            }
          } else {
            flattened[i] = this[i];
          }
        }
        return flattened;
      },
    });

    return this;
  }

  setIsObject() {
    this.checkAndDefine('isObject', {
      enumerable: false,
      writable: false,
      configurable: false,
      value: function() {
        return typeof this === 'object' &&
          !Array.isArray(this) &&
          this !== null;
      },
    });

    return this;
  }
}


module.exports = new Polyfills();

function getObjects() {
  return {
    plain: {
      _id: '111',
      title: 'test',
      admin: 'admin',
    },
    nested: {
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
    },
  };
}

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
        let obj = getObjects();
        this.plain = obj.plain;
        this.nested = obj.nested;
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

    describe('getFlatten', function() {
      before(function() {
        let obj = getObjects();
        this.plain = obj.plain;
        this.nested = obj.nested;
      });
      it('Should flatten nested object', function() {
        let object = this.nested.getClone();
        object = object.getFlatten();
        expect(object).to.be.an('object');
        expect(object).to.be.eql({
          'remove.test': 'test',
          'stay.stayNested.test': 'test',
          'stay.stayNested.removed': 'removed',
          'stay.removed': 'no',
          selfValue: 'self',
          removedSelfValue: 'no',
        });
      });
    });

    describe('isObject', function() {
      it('Checks different values', function() {
        expect(Object.prototype.isObject.call({})).to.be.equal(true);
        expect(Object.prototype.isObject.call({l: null})).to.be.equal(true);
        expect(Object.prototype.isObject.call('')).to.be.equal(false);
        expect(Object.prototype.isObject.call(null)).to.be.equal(false);
        expect(Object.prototype.isObject.call([])).to.be.equal(false);
      });
    });
  });
}

// test();
