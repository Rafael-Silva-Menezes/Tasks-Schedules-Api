import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateTasksUseCase } from '../update-tasks.use-case';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { UpdateTasksInput } from '../update-tasks.input';
import { UpdateTasksOutput } from '../update-tasks.use-case.interface';

describe('UpdateScheduleUseCase Unit Tests', () => {
  let useCase: UpdateTasksUseCase;
  let repository: TasksInMemoryRepository;

  beforeEach(() => {
    repository = new TasksInMemoryRepository();
    useCase = new UpdateTasksUseCase(repository);
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

  it('should update a tasks', async () => {
    const scheduleId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();
    const duration = 1000;
    const type = TasksType.WORK;

    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Tasks({ accountId, scheduleId, type });

    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.getTasksId().id,
      scheduleId: scheduleId.id,
      duration,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.getTasksId().id,
      scheduleId: scheduleId.id,
      accountId: accountId.id,
      type: type,
      createdAt: entity.getCreatedAt(),
      startTime: entity.getStartTime(),
      duration: duration,
    });
  });
});
