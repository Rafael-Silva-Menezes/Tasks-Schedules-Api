import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/testing/helpers';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import { ListScheduleUseCase } from './list-schedule.use-case';

describe('ListSchedulesUseCase Integration Tests', () => {
  let useCase: ListScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new ListScheduleUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const schedules = Schedule.fake()
      .theSchedules(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(schedules);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...schedules].reverse().map(ScheduleMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const accountId = new Uuid();
    const agentId = new Uuid();

    const schedules = [
      new Schedule({
        accountId: new Uuid(),
        createdAt: new Date(new Date().getTime() + 100),
      }),
      new Schedule({
        accountId,
        agentId: new Uuid(),
        createdAt: new Date(new Date().getTime() + 200),
      }),
      new Schedule({
        accountId,
        agentId,
        createdAt: new Date(new Date().getTime() + 300),
      }),
      new Schedule({
        accountId,
        agentId,
        createdAt: new Date(new Date().getTime() + 400),
      }),
      new Schedule({
        accountId,
        agentId,
        createdAt: new Date(new Date().getTime() + 500),
      }),
    ];

    await repository.bulkInsert(schedules);

    const output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'createdAt',
      sort_dir: 'asc',
      filter: agentId.id,
    });

    expect(output).toEqual({
      items: [schedules[2], schedules[3]].map(ScheduleMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
