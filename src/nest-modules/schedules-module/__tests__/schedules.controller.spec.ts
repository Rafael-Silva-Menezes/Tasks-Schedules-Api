import { CreateScheduleOutput } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case.interface';
import { SchedulesController } from '../schedules.controller';
import { CreateScheduleInput } from '@core/schedules/application/usecases/create-usecase/create-schedule.input';
import {
  ScheduleCollectionPresenter,
  SchedulePresenter,
} from '../schedules.presenter';
import { UpdateScheduleOutput } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case.interface';
import { UpdateScheduleInput } from '@core/schedules/application/usecases/update-usecase/update-schedule.input';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { ListSchedulesOutput } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case.interface';
import { GetScheduleOutput } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case.interface';
import { v4 as uuidv4 } from 'uuid';

describe('SchedulesController Unit Tests', () => {
  let controller: SchedulesController;

  beforeEach(async () => {
    controller = new SchedulesController();
  });

  it('should creates a schedule', async () => {
    const accountId = uuidv4();
    const agentId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const endTime = new Date('2024-06-10T09:00:00Z');
    const createdAt = new Date();

    const output: CreateScheduleOutput = {
      id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      accountId,
      agentId,
      startTime,
      endTime,
      createdAt,
    };
    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createUseCase'] = mockCreateUseCase;

    const input: CreateScheduleInput = {
      accountId,
      agentId,
      startTime,
      endTime,
    };

    const presenter = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(SchedulePresenter);
    expect(presenter).toStrictEqual(new SchedulePresenter(output));
  });

  it('should updates a schedule', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const agentId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const endTime = new Date('2024-06-10T09:00:00Z');
    const createdAt = new Date();

    const output: UpdateScheduleOutput = {
      id,
      accountId,
      agentId,
      startTime,
      endTime,
      createdAt,
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['updateUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateScheduleInput, 'id'> = {
      agentId,
      startTime,
      endTime,
    };
    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(SchedulePresenter);
    expect(presenter).toStrictEqual(new SchedulePresenter(output));
  });

  it('should deletes a schedule', async () => {
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

  it('should gets a schedule', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const agentId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const endTime = new Date('2024-06-10T09:00:00Z');
    const createdAt = new Date();

    const output: GetScheduleOutput = {
      id,
      accountId,
      agentId,
      createdAt,
      endTime,
      startTime,
    };
    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['getUseCase'] = mockGetUseCase;
    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(SchedulePresenter);
    expect(presenter).toStrictEqual(new SchedulePresenter(output));
  });

  it('should list schedules', async () => {
    const id = '9366b7dc-2d71-4799-b91c-c64adb205104';
    const accountId = uuidv4();
    const agentId = uuidv4();
    const startTime = new Date('2024-05-10T08:00:00Z');
    const endTime = new Date('2024-06-10T09:00:00Z');
    const createdAt = new Date();

    const output: ListSchedulesOutput = {
      items: [
        {
          id,
          accountId,
          agentId,
          createdAt,
          endTime,
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
      filter: 'test',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(ScheduleCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new ScheduleCollectionPresenter(output));
  });
});
