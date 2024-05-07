import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { DeleteTasksUseCase } from '../delete-tasks.use-case';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('DeleteTasksUseCase Unit Tests', () => {
  let useCase: DeleteTasksUseCase;
  let tasksRepository: TasksInMemoryRepository;

  beforeEach(() => {
    tasksRepository = new TasksInMemoryRepository();
    useCase = new DeleteTasksUseCase(tasksRepository);
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

    tasksRepository.items = items;
    await useCase.execute({
      id: items[0].getTasksId().id,
    });
    expect(tasksRepository.items).toHaveLength(0);
  });
});
