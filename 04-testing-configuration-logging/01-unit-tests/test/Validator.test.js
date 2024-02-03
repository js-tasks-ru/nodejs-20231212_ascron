const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('Конфигурация содержит неверные параметры валидации строки', () => {
      expect(() => new Validator({
          name: {
          type: 'string',
          min: 10,
          },
      })).to.throw('No max for field name');

      expect(() => new Validator({
          name: {
          type: 'string',
          max: 10,
          },
      })).to.throw('No min for field name');

      expect(() => new Validator({
        name: {
          max: 10,
          min: 10,
        },
      })).to.throw('No type for field name');
    });

    it('Конфигурация содержит корректные параметры валидации строки', () => {
      expect(() => new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      })).to.not.throw();
    });

    it('Конфигурация содержит неверные параметры валидации числа', () => {
        expect(() => new Validator({
            age: {
            type: 'number',
            min: 10,
            },
        })).to.throw('No max for field age');

        expect(() => new Validator({
            age: {
            type: 'number',
            max: 10,
            },
        })).to.throw('No min for field age');

        expect(() => new Validator({
            age: {
            max: 10,
            min: 10,
            },
        })).to.throw('No type for field age');
    });

    it('валидация параметров которые не указаны в конфигурации', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 12,
        },
      });

      const errors = validator.validate({ age: 14 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got undefined');
    });

    it('валидация параметров которые не указаны в конфигурации', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
        name: {
          type: 'string',
          min: 5,
          max: 10,
        }
      });

      const errors = validator.validate({ age: 18, name: 'Lalalala' });

      expect(errors).to.have.length(0);
    });

    it('проверяет строковые значения ниже минимума', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('проверяет строковые значения выше максимума', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 12,
        },
      });

      const errors = validator.validate({ name: 'Lalalalalalalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 12, got 16');
    });

    it('проверяет числовое значение ниже минимума', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 12,
        },
      });

      const errors = validator.validate({ age: 5 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');
    });

    it('проверяет числовое значение выше максимума', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 12,
        },
      });

      const errors = validator.validate({ age: 14 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 12, got 14');
    });
  });
});