import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { CreateTasksUseCase } from '@core/tasks/application/create-usecase/create-tasks.use-case';
import { DeleteTasksUseCase } from '@core/tasks/application/delete-usecase/delete-tasks.use-case';
import { GetTasksUseCase } from '@core/tasks/application/get-usecase/get-tasks.use-case';
import { ListTasksUseCase } from '@core/tasks/application/list-usecase/list-tasks.use-case';
import { UpdateTasksUseCase } from '@core/tasks/application/update-usecase/update-tasks.use-case';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { getModelToken } from '@nestjs/sequelize';
import { SCHEDULE_PROVIDERS } from '../schedules-module/schedules.providers';

export const REPOSITORIES = {
  TASKS_REPOSITORY: {
    provide: 'TasksRepository',
    useExisting: TasksSequelizeRepository,
  },
  TASKS_IN_MEMORY_REPOSITORY: {
    provide: TasksInMemoryRepository,
    useClass: TasksInMemoryRepository,
  },
  TASKS_SEQUELIZE_REPOSITORY: {
    provide: TasksSequelizeRepository,
    useFactory: (tasksModel: typeof TasksModel) => {
      return new TasksSequelizeRepository(tasksModel);
    },
    inject: [getModelToken(TasksModel)],
  },
};

export const USE_CASES = {
  CREATE_TASKS_USE_CASE: {
    provide: CreateTasksUseCase,
    useFactory: (
      tasksRepo: ITasksRepository,
      scheduleRepo: IScheduleRepository,
    ) => {
      return new CreateTasksUseCase(tasksRepo, scheduleRepo);
    },
    inject: [
      REPOSITORIES.TASKS_REPOSITORY.provide,
      SCHEDULE_PROVIDERS.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    ],
  },
  UPDATE_TASKS_USE_CASE: {
    provide: UpdateTasksUseCase,
    useFactory: (
      tasksRepo: ITasksRepository,
      scheduleRepo: IScheduleRepository,
    ) => {
      return new UpdateTasksUseCase(tasksRepo, scheduleRepo);
    },
    inject: [
      REPOSITORIES.TASKS_REPOSITORY.provide,
      SCHEDULE_PROVIDERS.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    ],
  },
  LIST_TASKS_USE_CASE: {
    provide: ListTasksUseCase,
    useFactory: (tasksRepo: ITasksRepository) => {
      return new ListTasksUseCase(tasksRepo);
    },
    inject: [REPOSITORIES.TASKS_REPOSITORY.provide],
  },
  GET_TASKS_USE_CASE: {
    provide: GetTasksUseCase,
    useFactory: (tasksRepo: ITasksRepository) => {
      return new GetTasksUseCase(tasksRepo);
    },
    inject: [REPOSITORIES.TASKS_REPOSITORY.provide],
  },
  DELETE_TASKS_USE_CASE: {
    provide: DeleteTasksUseCase,
    useFactory: (tasksRepo: ITasksRepository) => {
      return new DeleteTasksUseCase(tasksRepo);
    },
    inject: [REPOSITORIES.TASKS_REPOSITORY.provide],
  },
};

export const TASKS_PROVIDERS = {
  REPOSITORIES,
  USE_CASES,
};
