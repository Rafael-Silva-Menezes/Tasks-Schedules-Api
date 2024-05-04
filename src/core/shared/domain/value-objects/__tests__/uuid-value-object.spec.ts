import { validate as uuidValidate } from 'uuid';
import { InvalidUuidError, Uuid } from '../uuid-value-object';

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrow(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBe(true);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid uuid', () => {
    const uuid = new Uuid('a395570e-f936-4d4b-919e-b3c6a513ffd1');
    expect(uuid.id).toBe('a395570e-f936-4d4b-919e-b3c6a513ffd1');
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
