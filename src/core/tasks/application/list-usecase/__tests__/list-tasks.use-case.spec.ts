import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksInMemoryRepository } from '@core/tasks/infra/db/in-memory/tasks-in-memory.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ListTasksUseCase } from '../list-tasks.use-case';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { TasksMapper } from '../../common/tasks.use-case.mapper';

describe('ListTasksUseCase Unit Tests', () => {
  let useCase: ListTasksUseCase;
  let repository: TasksInMemoryRepository;

  beforeEach(() => {
    repository = new TasksInMemoryRepository();
    useCase = new ListTasksUseCase(repository);
  });

  it('should return output sorted by createdAt when input param is empty', async () => {
    const accountId = new Uuid();
    const scheduleId = new Uuid();
    const type = TasksType.WORK;

    const items = [
      new Tasks({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        createdAt: new Date(new Date().getTime() + 100),
      }),
      new Tasks({
        accountId,
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        createdAt: new Date(new Date().getTime() + 200),
      }),
      new Tasks({
        accountId,
        scheduleId,
        type,
        createdAt: new Date(new Date().getTime() + 300),
      }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [...items].reverse().map(TasksMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 5,
      last_page: 1,
    });
  });

  it('should return output using pagination, sort and filter', async () => {
    const accountId = new Uuid();
    const scheduleId = new Uuid();
    const type = TasksType.WORK;

    const items = [
      new Tasks({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        createdAt: new Date(new Date().getTime() + 100),
      }),
      new Tasks({
        accountId,
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        createdAt: new Date(new Date().getTime() + 200),
      }),
      new Tasks({
        accountId,
        scheduleId,
        type,
        createdAt: new Date(new Date().getTime() + 300),
      }),
      new Tasks({
        accountId,
        scheduleId,
        type,
        createdAt: new Date(new Date().getTime() + 400),
      }),
      new Tasks({
        accountId,
        scheduleId,
        type,
        createdAt: new Date(new Date().getTime() + 500),
      }),
    ];

    repository.items = items;

    const output = await useCase.execute({
      page: 1,
      per_page: 3,
      sort: 'createdAt',
      sort_dir: 'asc',
      filter: 'WORK',
    });

    expect(output).toStrictEqual({
      items: [items[2], items[3], items[4]].map(TasksMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 3,
      last_page: 1,
    });
  });
});
