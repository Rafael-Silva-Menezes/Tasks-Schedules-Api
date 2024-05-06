import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { GetTasksUseCase } from '../get-tasks.use-case';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';

describe('GetTasksUseCase Unit Tests', () => {
  let useCase: GetTasksUseCase;
  let repository: TasksInMemoryRepository;

  beforeEach(() => {
    repository = new TasksInMemoryRepository();
    useCase = new GetTasksUseCase(repository);
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

  it('should returns a tasks', async () => {
    const accountId = new Uuid();
    const scheduleId = new Uuid();
    const startTime = new Date();
    const type = TasksType.WORK;
    const duration = 1000;

    const items = [
      Tasks.create({ accountId, scheduleId, startTime, type, duration }),
    ];
    repository.items = items;

    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].getTasksId().id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].getTasksId().id,
      accountId: items[0].getAccountId().id,
      scheduleId: items[0].getScheduleId().id,
      startTime: items[0].getStartTime(),
      type: items[0].getType(),
      duration: items[0].getDuration(),
      createdAt: items[0].getCreatedAt(),
    });
  });
});
