import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { applyGlobalConfig } from '../../global-config';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

export function startApp() {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    await _app.init();

    const sequelize = moduleFixture.get<Sequelize>(getConnectionToken());

    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await _app?.close();
  });

  return {
    get app() {
      return _app;
    },
  };
}
