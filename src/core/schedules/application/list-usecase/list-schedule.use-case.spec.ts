import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import { ListScheduleUseCase } from './list-schedule.use-case';

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new ListScheduleUseCase(repository);
  });

  it('should return output sorted by createdAt when input param is empty', async () => {
    const accountId = new Uuid();
    const agentId = new Uuid();

    const items = [
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
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(ScheduleMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const accountId = new Uuid();
    const agentId = new Uuid();

    const items = [
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

    repository.items = items;

    const output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'createdAt',
      sort_dir: 'asc',
      filter: agentId.id,
    });

    expect(output).toStrictEqual({
      items: [items[2], items[3]].map(ScheduleMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
