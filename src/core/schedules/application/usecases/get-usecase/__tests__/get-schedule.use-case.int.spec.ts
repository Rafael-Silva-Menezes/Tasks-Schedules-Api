import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { GetScheduleUseCase } from '../get-schedule.use-case';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';

describe('GetScheduleUseCase Integration Tests', () => {
  let useCase: GetScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel, TasksModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new GetScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Schedule),
    );
  });

  it('should returns a schedule', async () => {
    const schedule = Schedule.fake()
      .aSchedule()
      .withAgentId(new Uuid())
      .build();
    await repository.insert(schedule);
    const output = await useCase.execute({ id: schedule.getScheduleId().id });
    expect(output).toStrictEqual({
      id: schedule.getScheduleId().id,
      accountId: schedule.getAccountId().id,
      agentId: schedule.getAgentId().id,
      startTime: schedule.getStartTime(),
      endTime: schedule.getEndTime(),
      createdAt: schedule.getCreatedAt(),
      tasks: [],
    });
  });
});
