import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { DeleteScheduleUseCase } from '../delete-schedule.use-case';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';

describe('DeleteScheduleUseCase Integration Tests', () => {
  let useCase: DeleteScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel, TasksModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new DeleteScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Schedule),
    );
  });

  it('should delete a schedule', async () => {
    const schedule = Schedule.fake().aSchedule().build();
    await repository.insert(schedule);

    await useCase.execute({
      id: schedule.getScheduleId().id,
    });
    await expect(
      repository.findById(schedule.getScheduleId()),
    ).resolves.toBeNull();
  });
});
