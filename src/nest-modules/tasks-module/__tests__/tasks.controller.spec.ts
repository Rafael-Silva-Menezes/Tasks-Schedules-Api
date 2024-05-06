import { v4 as uuidv4 } from 'uuid';
import { TasksController } from '../tasks.controller';
import { CreateTasksOutput } from '@core/tasks/application/create-usecase/create-tasks.use-case.interface';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { CreateTasksInput } from '@core/tasks/application/create-usecase/create-tasks.input';
import { TasksCollectionPresenter, TasksPresenter } from '../tasks.presenter';
import { UpdateTasksOutput } from '@core/tasks/application/update-usecase/update-tasks.use-case.interface';
import { UpdateTasksInput } from '@core/tasks/application/update-usecase/update-tasks.input';
import { GetTasksOutput } from '@core/tasks/application/get-usecase/get-tasks.use-case.interface';
import { ListTasksOutput } from '@core/tasks/application/list-usecase/list-tasks.use-case.interface';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';

describe('TasksController Unit Tests', () => {
  let controller: TasksController;

  beforeEach(async () => {
    controller = new TasksController();
  });

  it('should creates a tasks', async () => {
    const accountId = uuidv4();
    const scheduleId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const type = TasksType.WORK;
    const duration = 1000;
    const createdAt = new Date();

    const output: CreateTasksOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      accountId,
      scheduleId,
      type,
      startTime,
      duration,
      createdAt,
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateTasksInput = {
      accountId,
      scheduleId,
      startTime,
      type,
      duration,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(TasksPresenter);
    expect(presenter).toStrictEqual(new TasksPresenter(output));
  });

  it('should updates a tasks', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const scheduleId = uuidv4();
    const type = TasksType.WORK;
    const startTime = new Date('2024-05-10T08:00:00Z');
    const duration = 2000;
    const createdAt = new Date();

    const output: UpdateTasksOutput = {
      id,
      accountId,
      scheduleId,
      type,
      startTime,
      duration,
      createdAt,
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateTasksInput, 'id'> = {
      scheduleId,
      type,
      startTime,
      duration,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(TasksPresenter);
    expect(presenter).toStrictEqual(new TasksPresenter(output));
  });

  it('should deletes a tasks', async () => {
    const expectedOutput = undefined;
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error defined part of methods
    controller['deleteUseCase'] = mockDeleteUseCase;
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(expectedOutput).toStrictEqual(output);
  });

  it('should gets a tasks', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const scheduleId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const type = TasksType.WORK;
    const duration = 2000;
    const createdAt = new Date();

    const output: GetTasksOutput = {
      id,
      accountId,
      scheduleId,
      createdAt,
      duration,
      type,
      startTime,
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(TasksPresenter);
    expect(presenter).toStrictEqual(new TasksPresenter(output));
  });

  it('should list tasks', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const scheduleId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const type = TasksType.WORK;
    const duration = 2000;
    const createdAt = new Date();

    const output: ListTasksOutput = {
      items: [
        {
          id,
          accountId,
          scheduleId,
          createdAt,
          type,
          duration,
          startTime,
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['listUseCase'] = mockListUseCase;
    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc' as SortDirection,
      filter: 'work',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(TasksCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new TasksCollectionPresenter(output));
  });
});
