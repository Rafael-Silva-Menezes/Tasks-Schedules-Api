import { ConfigModule } from '@nestjs/config';
import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { SchedulesController } from '../schedules.controller';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { SchedulesModule } from '../schedules.module';
import { SCHEDULE_PROVIDERS } from '../schedules.providers';
import { CreateScheduleUseCase } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case';
import { DeleteScheduleUseCase } from '@core/schedules/application/usecases/delete-usecase/delete-schedule.use-case';
import { GetScheduleUseCase } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case';
import { UpdateScheduleUseCase } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case';
import { ListScheduleUseCase } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case';

describe('SchedulesController Integration Tests', () => {
  let controller: SchedulesController;
  let repository: IScheduleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, SchedulesModule],
    }).compile();
    controller = module.get<SchedulesController>(SchedulesController);
    repository = module.get<IScheduleRepository>(
      SCHEDULE_PROVIDERS.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateScheduleUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateScheduleUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListScheduleUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetScheduleUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteScheduleUseCase);
  });

  it('should create a category', () => {});

  it('should update a category', () => {});
});
