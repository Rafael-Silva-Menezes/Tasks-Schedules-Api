import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { DeleteTasksUseCase } from '../delete-tasks.use-case';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('DeleteTasksUseCase Integration Tests', () => {
  let useCase: DeleteTasksUseCase;
  let tasksRepository: TasksSequelizeRepository;
  let scheduleRepository: ScheduleSequelizeRepository;

  setupSequelize({ models: [TasksModel, ScheduleModel] });

  beforeEach(() => {
    tasksRepository = new TasksSequelizeRepository(TasksModel);
    scheduleRepository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new DeleteTasksUseCase(tasksRepository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Tasks),
    );
  });

  it('should delete a tasks', async () => {
    const schedule = Schedule.fake().aSchedule().build();
    const tasks = Tasks.fake()
      .aTasks()
      .withScheduleId(schedule.getScheduleId())
      .build();

    await scheduleRepository.insert(schedule);
    await tasksRepository.insert(tasks);

    await useCase.execute({
      id: tasks.getTasksId().id,
    });
    await expect(
      tasksRepository.findById(tasks.getScheduleId()),
    ).resolves.toBeNull();
  });
});
