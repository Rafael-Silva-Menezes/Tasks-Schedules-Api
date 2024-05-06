import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { TasksController } from 'src/nest-modules/tasks-module/tasks.controller';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { TASKS_PROVIDERS } from 'src/nest-modules/tasks-module/tasks.providers';
import { TasksModule } from 'src/nest-modules/tasks-module/tasks.module';
import { CreateTasksUseCase } from '@core/tasks/application/create-usecase/create-tasks.use-case';
import { UpdateTasksUseCase } from '@core/tasks/application/update-usecase/update-tasks.use-case';
import { ListTasksUseCase } from '@core/tasks/application/list-usecase/list-tasks.use-case';
import { GetTasksUseCase } from '@core/tasks/application/get-usecase/get-tasks.use-case';
import { DeleteTasksUseCase } from '@core/tasks/application/delete-usecase/delete-tasks.use-case';
import {
  CreateTasksFixture,
  ListTasksFixture,
  UpdateTasksFixture,
} from 'src/nest-modules/tasks-module/helpers/tasks-fixture';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';
import {
  TasksCollectionPresenter,
  TasksPresenter,
} from 'src/nest-modules/tasks-module/tasks.presenter';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

describe('TasksController Integration Tests', () => {
  let controller: TasksController;
  let repository: ITasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, TasksModule],
    }).compile();
    controller = module.get<TasksController>(TasksController);
    repository = module.get<ITasksRepository>(
      TASKS_PROVIDERS.REPOSITORIES.TASKS_REPOSITORY.provide,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['createUseCase']).toBeInstanceOf(CreateTasksUseCase);
    expect(controller['updateUseCase']).toBeInstanceOf(UpdateTasksUseCase);
    expect(controller['listUseCase']).toBeInstanceOf(ListTasksUseCase);
    expect(controller['getUseCase']).toBeInstanceOf(GetTasksUseCase);
    expect(controller['deleteUseCase']).toBeInstanceOf(DeleteTasksUseCase);
  });

  describe('should create a tasks', () => {
    const arrange = CreateTasksFixture.arrangeForCreate();

    test.each(arrange)('should send $title', async ({ send_data }) => {
      const presenter = await controller.create(send_data);
      const entity = await repository.findById(new Uuid(presenter.id));
      const output = TasksMapper.toOutput(entity);
      expect(presenter).toEqual(new TasksPresenter(output));
    });
  });

  describe('should update a tasks', () => {
    const arrange = UpdateTasksFixture.arrangeForUpdate();

    const tasks = Tasks.fake().aTasks().build();

    beforeEach(async () => {
      await repository.insert(tasks);
    });

    test.each(arrange)('when body is $send_data', async ({ send_data }) => {
      const presenter = await controller.update(
        tasks.getTasksId().id,
        send_data,
      );
      const entity = await repository.findById(new Uuid(presenter.id));

      expect(entity.toJson()).toStrictEqual({
        tasksId: presenter.id,
        createdAt: presenter.createdAt,
        accountId: presenter.accountId,
        scheduleId: presenter.scheduleId,
        type: presenter.type,
        startTime: presenter.startTime ? new Date(presenter.startTime) : null,
        duration: presenter.duration ?? null,
      });
      const output = TasksMapper.toOutput(entity);
      expect(presenter).toEqual(new TasksPresenter(output));
    });
  });

  describe('should delete a tasks', () => {
    it('should send a id exist', async () => {
      const tasks = Tasks.fake().aTasks().build();
      await repository.insert(tasks);
      const response = await controller.remove(tasks.getTasksId().id);
      expect(response).not.toBeDefined();
      await expect(repository.findById(tasks.getTasksId())).resolves.toBeNull();
    });
  });

  describe('should get a tasks', () => {
    it('should get a tasks', async () => {
      const tasks = Tasks.fake().aTasks().build();

      await repository.insert(tasks);
      const presenter = await controller.findOne(tasks.getTasksId().id);

      expect(presenter.id).toBe(tasks.getTasksId().id);
      expect(presenter.accountId).toBe(tasks.getAccountId().id);
      expect(presenter.scheduleId).toBe(tasks.getScheduleId().id);
      expect(presenter.type).toStrictEqual(tasks.getType());
      expect(presenter.startTime).toStrictEqual(tasks.getStartTime());
      expect(presenter.duration).toStrictEqual(tasks.getDuration());
      expect(presenter.createdAt).toStrictEqual(tasks.getCreatedAt());
    });
  });

  describe('search method', () => {
    describe('should sorted tasks by created_at', () => {
      const { entitiesMap, arrange } =
        ListTasksFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        await repository.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when send_data is $send_data',
        async ({ send_data, expected }) => {
          const presenter = await controller.search(send_data);
          const { entities, ...paginationProps } = expected;
          expect(presenter).toEqual(
            new TasksCollectionPresenter({
              items: entities.map(TasksMapper.toOutput),
              ...paginationProps.meta,
            }),
          );
        },
      );
    });
  });
});
