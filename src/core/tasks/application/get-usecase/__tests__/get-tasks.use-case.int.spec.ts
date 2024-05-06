import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { GetTasksUseCase } from '../get-tasks.use-case';

describe('GetTasksUseCase Integration Tests', () => {
  let useCase: GetTasksUseCase;
  let repository: TasksSequelizeRepository;

  setupSequelize({ models: [TasksModel] });

  beforeEach(() => {
    repository = new TasksSequelizeRepository(TasksModel);
    useCase = new GetTasksUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Tasks),
    );
  });

  it('should returns a tasks', async () => {
    const tasks = Tasks.fake().aTasks().build();

    await repository.insert(tasks);
    const output = await useCase.execute({ id: tasks.getTasksId().id });
    expect(output).toStrictEqual({
      id: tasks.getTasksId().id,
      accountId: tasks.getAccountId().id,
      scheduleId: tasks.getScheduleId().id,
      startTime: tasks.getStartTime(),
      type: tasks.getType(),
      duration: tasks.getDuration(),
      createdAt: tasks.getCreatedAt(),
    });
  });
});
