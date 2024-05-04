import { Test, TestingModule } from '@nestjs/testing';
import { SchedulesController } from './schedules.controller';
import { DatabaseModule } from 'src/nest-modules/database/database.module';
import { SchedulesModule } from './schedules.module';
import { ConfigModule } from '../config/config.module';

describe('SchedulesController', () => {
  let controller: SchedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, SchedulesModule],
    }).compile();

    controller = module.get<SchedulesController>(SchedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
