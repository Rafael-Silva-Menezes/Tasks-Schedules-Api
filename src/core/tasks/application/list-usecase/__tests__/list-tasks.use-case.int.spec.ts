import { TasksSequelizeRepository } from '@core/tasks/infra/db/sequelize/repository/tasks-sequelize.repository';
import { ListTasksUseCase } from '../list-tasks.use-case';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksMapper } from '../../common/tasks.use-case.mapper';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

describe('ListTasksUseCase Integration Tests', () => {
  let useCase: ListTasksUseCase;
  let repository: TasksSequelizeRepository;

  setupSequelize({ models: [TasksModel] });

  beforeEach(() => {
    repository = new TasksSequelizeRepository(TasksModel);
    useCase = new ListTasksUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const schedules = Tasks.fake()
      .theTasks(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(schedules);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...schedules].reverse().map(TasksMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 5,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const accountId = new Uuid();
    const scheduleId = new Uuid();
    const type = TasksType.WORK;

    const tasks = [
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

    await repository.bulkInsert(tasks);

    const output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'createdAt',
      sort_dir: 'asc',
      filter: 'WORK',
    });

    expect(output).toEqual({
      items: [tasks[2], tasks[3]].map(TasksMapper.toOutput),
      total: 3,
      current_page: 1,
      last_page: 2,
      per_page: 2,
    });
  });
});
