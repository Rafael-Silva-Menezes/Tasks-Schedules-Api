import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Config } from '../config';

export function setupSequelize(options: SequelizeOptions = {}) {
  let _sequelize: Sequelize;

  beforeAll(async () => {
    _sequelize = new Sequelize({
      ...Config.db(),
      ...options,
    });
  });

  beforeEach(async () => await _sequelize.sync({ force: true }));
  afterEach(async () => {
    // Limpeza do banco de dados
    const modelNames = Object.keys(_sequelize.models);
    await Promise.all(
      modelNames.map((modelName) =>
        _sequelize.models[modelName].destroy({ truncate: true, cascade: true }),
      ),
    );
  });
  afterAll(async () => await _sequelize.close());

  return {
    get sequelize() {
      return _sequelize;
    },
  };
}
