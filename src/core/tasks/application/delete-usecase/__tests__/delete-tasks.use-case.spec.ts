import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { DeleteTasksUseCase } from '../delete-tasks.use-case';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

describe('DeleteTasksUseCase Unit Tests', () => {
  let useCase: DeleteTasksUseCase;
  let repository: TasksInMemoryRepository;

  beforeEach(() => {
    repository = new TasksInMemoryRepository();
    useCase = new DeleteTasksUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Tasks),
    );
  });

  it('should delete a tasks', async () => {
    const items = [
      new Tasks({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      }),
    ];
    repository.items = items;
    await useCase.execute({
      id: items[0].getTasksId().id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
