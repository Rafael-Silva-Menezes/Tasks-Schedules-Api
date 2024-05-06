import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateScheduleUseCase } from '../update-schedule.use-case';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';

describe('UpdateScheduleUseCase Integration Tests', () => {
  let useCase: UpdateScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel, TasksModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new UpdateScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const { id } = new Uuid();
    await expect(() => useCase.execute({ id })).rejects.toThrow(
      new NotFoundError(id, Schedule),
    );
  });

  it('should update a schedule', async () => {
    const agentId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();
    const endTime = new Date();

    const entity = Schedule.fake().aSchedule().withAccountId(accountId).build();
    repository.insert(entity);

    const output = await useCase.execute({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
      startTime,
      endTime,
    });

    expect(output).toStrictEqual({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
      accountId: entity.getAccountId().id,
      startTime,
      endTime,
      createdAt: entity.getCreatedAt(),
    });
  });
});
