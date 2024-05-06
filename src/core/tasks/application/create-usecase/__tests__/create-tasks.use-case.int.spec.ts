import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTasksUseCase } from '../create-tasks.use-case';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

describe('CreateTasksUseCase Integration Tests', () => {
  let useCase: CreateTasksUseCase;
  let repository: TasksSequelizeRepository;

  setupSequelize({ models: [TasksModel] });

  beforeEach(() => {
    repository = new TasksSequelizeRepository(TasksModel);
    useCase = new CreateTasksUseCase(repository);
  });

  it('should create a tasks', async () => {
    const accountId = uuidv4();
    const scheduleId = uuidv4();

    let output = await useCase.execute({
      accountId,
      scheduleId,
      type: TasksType.BREAK,
      startTime: new Date(),
      duration: 100,
    });

    let entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.getTasksId().id,
      scheduleId: entity.getScheduleId().id,
      accountId: entity.getAccountId().id,
      duration: entity.getDuration(),
      startTime: entity.getStartTime(),
      type: entity.getType(),
      createdAt: entity.getCreatedAt(),
    });

    output = await useCase.execute({
      accountId,
      scheduleId,
      type: TasksType.WORK,
    });

    entity = await repository.findById(new Uuid(output.id));

    expect(output).toStrictEqual({
      id: entity.getTasksId().id,
      scheduleId: entity.getScheduleId().id,
      accountId: entity.getAccountId().id,
      startTime: null,
      duration: null,
      type: TasksType.WORK,
      createdAt: entity.getCreatedAt(),
    });
  });
});
