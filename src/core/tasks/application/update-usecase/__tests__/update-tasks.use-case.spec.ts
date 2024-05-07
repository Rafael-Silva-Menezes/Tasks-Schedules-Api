import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateTasksUseCase } from '../update-tasks.use-case';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('UpdateScheduleUseCase Unit Tests', () => {
  let useCase: UpdateTasksUseCase;
  let tasksRepository: TasksInMemoryRepository;
  let scheduleRepository: ScheduleInMemoryRepository;

  beforeEach(() => {
    tasksRepository = new TasksInMemoryRepository();
    scheduleRepository = new ScheduleInMemoryRepository();
    useCase = new UpdateTasksUseCase(tasksRepository, scheduleRepository);
  });

  it('should throws error when entity not found', async () => {
    const schedule = Schedule.fake().aSchedule().build();
    const scheduleId = schedule.getScheduleId().id;

    await scheduleRepository.insert(schedule);
    await expect(() =>
      useCase.execute({
        id: 'fake id',
        scheduleId,
      }),
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id, scheduleId }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Tasks));
  });

  it('should update a tasks', async () => {
    const scheduleId = new Uuid();
    const accountId = new Uuid();
    const duration = 1000;
    const type = TasksType.WORK;

    const schedule = Schedule.fake()
      .aSchedule()
      .withScheduleId(scheduleId)
      .build();

    await scheduleRepository.insert(schedule);

    const spyUpdate = jest.spyOn(tasksRepository, 'update');
    const entity = new Tasks({ accountId, scheduleId, type });

    tasksRepository.items = [entity];

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
