import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { DeleteTasksUseCase } from '../delete-tasks.use-case';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

describe('DeleteTasksUseCase Integration Tests', () => {
  let useCase: DeleteTasksUseCase;
  let repository: TasksSequelizeRepository;

  setupSequelize({ models: [TasksModel] });

  beforeEach(() => {
    repository = new TasksSequelizeRepository(TasksModel);
    useCase = new DeleteTasksUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Tasks),
    );
  });

  it('should delete a tasks', async () => {
    const tasks = Tasks.fake().aTasks().build();
    await repository.insert(tasks);

    await useCase.execute({
      id: tasks.getTasksId().id,
    });
    await expect(
      repository.findById(tasks.getScheduleId()),
    ).resolves.toBeNull();
  });
});
