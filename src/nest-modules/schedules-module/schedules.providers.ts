import { CreateScheduleUseCase } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case';
import { DeleteScheduleUseCase } from '@core/schedules/application/usecases/delete-usecase/delete-schedule.use-case';
import { GetScheduleUseCase } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case';
import { ListScheduleUseCase } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case';
import { UpdateScheduleUseCase } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { getModelToken } from '@nestjs/sequelize';

export const REPOSITORIES = {
  SCHEDULE_REPOSITORY: {
    provide: 'ScheduleRepository',
    useExisting: ScheduleSequelizeRepository,
  },
  SCHEDULE_IN_MEMORY_REPOSITORY: {
    provide: ScheduleInMemoryRepository,
    useClass: ScheduleInMemoryRepository,
  },
  SCHEDULE_SEQUELIZE_REPOSITORY: {
    provide: ScheduleSequelizeRepository,
    useFactory: (scheduleModel: typeof ScheduleModel) => {
      return new ScheduleSequelizeRepository(scheduleModel);
    },
    inject: [getModelToken(ScheduleModel)],
  },
};

export const USE_CASES = {
  CREATE_SCHEDULE_USE_CASE: {
    provide: CreateScheduleUseCase,
    useFactory: (scheduleRepo: IScheduleRepository) => {
      return new CreateScheduleUseCase(scheduleRepo);
    },
    inject: [REPOSITORIES.SCHEDULE_REPOSITORY.provide],
  },
  UPDATE_SCHEDULE_USE_CASE: {
    provide: UpdateScheduleUseCase,
    useFactory: (scheduleRepo: IScheduleRepository) => {
      return new UpdateScheduleUseCase(scheduleRepo);
    },
    inject: [REPOSITORIES.SCHEDULE_REPOSITORY.provide],
  },
  LIST_SCHEDULES_USE_CASE: {
    provide: ListScheduleUseCase,
    useFactory: (scheduleRepo: IScheduleRepository) => {
      return new ListScheduleUseCase(scheduleRepo);
    },
    inject: [REPOSITORIES.SCHEDULE_REPOSITORY.provide],
  },
  GET_SCHEDULE_USE_CASE: {
    provide: GetScheduleUseCase,
    useFactory: (scheduleRepo: IScheduleRepository) => {
      return new GetScheduleUseCase(scheduleRepo);
    },
    inject: [REPOSITORIES.SCHEDULE_REPOSITORY.provide],
  },
  DELETE_SCHEDULE_USE_CASE: {
    provide: DeleteScheduleUseCase,
    useFactory: (scheduleRepo: IScheduleRepository) => {
      return new DeleteScheduleUseCase(scheduleRepo);
    },
    inject: [REPOSITORIES.SCHEDULE_REPOSITORY.provide],
  },
};

export const SCHEDULE_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
