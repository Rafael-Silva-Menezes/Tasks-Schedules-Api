import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateTasksUseCase } from '../update-tasks.use-case';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

describe('UpdateTasksUseCase Integration Tests', () => {
  let useCase: UpdateTasksUseCase;
  let repository: TasksSequelizeRepository;

  setupSequelize({ models: [TasksModel] });

  beforeEach(() => {
    repository = new TasksSequelizeRepository(TasksModel);
    useCase = new UpdateTasksUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const { id } = new Uuid();
    await expect(() => useCase.execute({ id })).rejects.toThrow(
      new NotFoundError(id, Tasks),
    );
  });

  it('should update a tasks', async () => {
    const scheduleId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();

    const entity = Tasks.fake()
      .aTasks()
      .withAccountId(accountId)
      .withDuration(1000)
      .build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.getTasksId().id,
      scheduleId: scheduleId.id,
      startTime,
    });

    expect(output).toStrictEqual({
      id: entity.getTasksId().id,
      scheduleId: scheduleId.id,
      accountId: entity.getAccountId().id,
      type: entity.getType(),
      startTime,
      duration: 1000,
      createdAt: entity.getCreatedAt(),
    });
  });
});
