import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { SchedulesController } from '../schedules.controller';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { SchedulesModule } from '../schedules.module';
import { SCHEDULE_PROVIDERS } from '../schedules.providers';
import { CreateScheduleUseCase } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case';
import { DeleteScheduleUseCase } from '@core/schedules/application/usecases/delete-usecase/delete-schedule.use-case';
import { GetScheduleUseCase } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case';
import { UpdateScheduleUseCase } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case';
import { ListScheduleUseCase } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case';
import {
  CreateScheduleFixture,
  ListSchedulesFixture,
  UpdateScheduleFixture,
} from '../helpers/schedules-fixture';
import {
  ScheduleCollectionPresenter,
  SchedulePresenter,
} from '../schedules.presenter';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ScheduleMapper } from '@core/schedules/application/usecases/common/schedule.use-case.mapper';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { TasksModule } from 'src/nest-modules/tasks-module/tasks.module';

describe('SchedulesController Integration Tests', () => {
  let controller: SchedulesController;
  let repository: IScheduleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        TasksModule,
        SchedulesModule,
      ],
    }).compile();
    controller = module.get<SchedulesController>(SchedulesController);
    repository = module.get<IScheduleRepository>(
      SCHEDULE_PROVIDERS.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateScheduleUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateScheduleUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListScheduleUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetScheduleUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteScheduleUseCase);
  });

  describe('should create a schedule', () => {
    const arrange = CreateScheduleFixture.arrangeForCreate();

    test.each(arrange)(
      'should send $title',
      async ({ send_data, expected }) => {
        const presenter = await controller.create(send_data);
        const entity = await repository.findById(new Uuid(presenter.id));
        const output = ScheduleMapper.toOutput(entity);
        expect(presenter).toEqual(new SchedulePresenter(output));
      },
    );
  });

  describe('should update a schedule', () => {
    const arrange = UpdateScheduleFixture.arrangeForUpdate();

    const schedule = Schedule.fake().aSchedule().build();

    beforeEach(async () => {
      await repository.insert(schedule);
    });

    test.each(arrange)(
      'when body is $send_data',
      async ({ send_data, expected }) => {
        const presenter = await controller.update(
          schedule.getScheduleId().id,
          send_data,
        );
        const entity = await repository.findById(new Uuid(presenter.id));

        expect(entity.toJson()).toStrictEqual({
          scheduleId: presenter.id,
          createdAt: presenter.createdAt,
          accountId: presenter.accountId,
          agentId: expected.agentId ?? null,
          startTime: expected.startTime ? new Date(expected.startTime) : null,
          endTime: expected.endTime ? new Date(expected.endTime) : null,
          tasks: [],
        });
        const output = ScheduleMapper.toOutput(entity);
        expect(presenter).toEqual(new SchedulePresenter(output));
      },
    );
  });

  describe('should delete a schedule', () => {
    it('should send a id exist', async () => {
      const schedule = Schedule.fake().aSchedule().build();
      await repository.insert(schedule);
      const response = await controller.remove(schedule.getScheduleId().id);
      expect(response).not.toBeDefined();
      await expect(
        repository.findById(schedule.getScheduleId()),
      ).resolves.toBeNull();
    });
  });

  describe('should get a schedule', () => {
    it('should get a category', async () => {
      const schedule = Schedule.fake()
        .aSchedule()
        .withAgentId(new Uuid())
        .build();

      await repository.insert(schedule);
      const presenter = await controller.findOne(schedule.getScheduleId().id);

      expect(presenter.id).toBe(schedule.getScheduleId().id);
      expect(presenter.accountId).toBe(schedule.getAccountId().id);
      expect(presenter.agentId).toBe(schedule.getAgentId().id);
      expect(presenter.startTime).toStrictEqual(schedule.getStartTime());
      expect(presenter.endTime).toStrictEqual(schedule.getEndTime());
      expect(presenter.createdAt).toStrictEqual(schedule.getCreatedAt());
    });
  });

  describe('search method', () => {
    describe('should sorted schedules by created_at', () => {
      const { entitiesMap, arrange } =
        ListSchedulesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new ScheduleCollectionPresenter({
              items: entities.map(ScheduleMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
