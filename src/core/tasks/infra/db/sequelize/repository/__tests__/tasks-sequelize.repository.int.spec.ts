import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { TasksModel } from '../../model/tasks.model';
import { TasksSequelizeRepository } from '../tasks-sequelize.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { TasksModelMapper } from '../../model/tasks-mapper.model';
import {
  TasksSearchParams,
  TasksSearchResult,
} from '@core/tasks/domain/interfaces/tasks.repository';

describe('TasksSequelizeRepository Integration Tests', () => {
  let repository: TasksSequelizeRepository;
  setupSequelize({ models: [TasksModel] });

  beforeEach(async () => {
    repository = new TasksSequelizeRepository(TasksModel);
  });

  describe('CRUD operations in database', () => {
    it('Should insert a new entity', async () => {
      let tasks = Tasks.fake().aTasks().build();
      await repository.insert(tasks);
      let entity = await repository.findById(tasks.getTasksId());
      expect(entity.toJson()).toStrictEqual(tasks.toJson());
    });

    it('should finds a entity by id', async () => {
      let entityFound = await repository.findById(new Uuid());
      expect(entityFound).toBeNull();

      const entity = Tasks.fake().aTasks().build();
      await repository.insert(entity);
      entityFound = await repository.findById(entity.getTasksId());
      expect(entity.toJson()).toStrictEqual(entityFound.toJson());
    });

    it('should return all tasks', async () => {
      const entity = Tasks.fake().aTasks().build();
      await repository.insert(entity);
      const entities = await repository.findAll();
      expect(entities).toHaveLength(1);
      expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    });

    it('should throw error on update when a entity not found', async () => {
      const entity = Tasks.fake().aTasks().build();
      await expect(repository.update(entity)).rejects.toThrow(
        new NotFoundError(entity.getTasksId().id, Tasks),
      );
    });

    it('should update a entity', async () => {
      const entity = Tasks.fake().aTasks().build();
      await repository.insert(entity);

      entity.setScheduleId(new Uuid());
      await repository.update(entity);

      const entityFound = await repository.findById(entity.getTasksId());
      expect(entity.toJson()).toStrictEqual(entityFound.toJson());
    });

    it('should throw error on delete when a entity not found', async () => {
      const tasksId = new Uuid();
      await expect(repository.delete(tasksId)).rejects.toThrow(
        new NotFoundError(tasksId.id, Tasks),
      );
    });

    it('should delete a entity', async () => {
      const entity = new Tasks({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        tasksId: new Uuid(),
        startTime: new Date(),
        duration: 100,
        createdAt: new Date(),
      });

      await repository.insert(entity);

      await repository.delete(entity.getTasksId());
      await expect(
        repository.findById(entity.getTasksId()),
      ).resolves.toBeNull();
    });
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const createdAt = new Date();
      const accountId = new Uuid();
      const scheduleId = new Uuid();

      const tasks = Tasks.fake()
        .theTasks(16)
        .withScheduleId(scheduleId)
        .withDuration(1000)
        .withAccountId(accountId)
        .withCreatedAt(createdAt)
        .build();

      await repository.bulkInsert(tasks);
      const spyToEntity = jest.spyOn(TasksModelMapper, 'toEntity');

      const searchOutput = await repository.search(new TasksSearchParams());
      expect(searchOutput).toBeInstanceOf(TasksSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(5);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 4,
        per_page: 5,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Tasks);
        expect(item.getAccountId()).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJson());
      expect(items).toMatchObject(
        new Array(5).fill({
          scheduleId: scheduleId.id,
          accountId: accountId.id,
          createdAt,
        }),
      );
    });

    it('should order by createdAt DESC when search params are null', async () => {
      const createdAt = new Date();
      const tasks = Tasks.fake()
        .theTasks(16)
        .withScheduleId(new Uuid())
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      const searchOutput = await repository.search(new TasksSearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.getCreatedAt()).toBe(tasks[index + 1].getCreatedAt());
      });
    });
  });
});
