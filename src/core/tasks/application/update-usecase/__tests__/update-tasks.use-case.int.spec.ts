import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateTasksUseCase } from '../update-tasks.use-case';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('UpdateTasksUseCase Integration Tests', () => {
  let useCase: UpdateTasksUseCase;
  let tasksRepository: TasksSequelizeRepository;
  let scheduleRepository: ScheduleSequelizeRepository;

  setupSequelize({ models: [TasksModel, ScheduleModel] });

  beforeEach(() => {
    tasksRepository = new TasksSequelizeRepository(TasksModel);
    scheduleRepository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new UpdateTasksUseCase(tasksRepository, scheduleRepository);
  });

  it('should throws error when entity not found', async () => {
    const { id } = new Uuid();
    const scheduleId = new Uuid();

    const schedule = Schedule.fake()
      .aSchedule()
      .withScheduleId(scheduleId)
      .build();

    await scheduleRepository.insert(schedule);
    await expect(() =>
      useCase.execute({ id, scheduleId: scheduleId.id }),
    ).rejects.toThrow(new NotFoundError(id, Tasks));
  });

  it('should update a tasks', async () => {
    const scheduleId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();

    const schedule = Schedule.fake()
      .aSchedule()
      .withScheduleId(scheduleId)
      .build();

    await scheduleRepository.insert(schedule);

    const entity = Tasks.fake()
      .aTasks()
      .withAccountId(accountId)
      .withScheduleId(scheduleId)
      .withDuration(1000)
      .build();
    tasksRepository.insert(entity);

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
