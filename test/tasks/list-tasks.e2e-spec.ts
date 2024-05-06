import request from 'supertest';
import { instanceToPlain } from 'class-transformer';

import * as TasksProviders from 'src/nest-modules/tasks-module/tasks.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { ListTasksFixture } from 'src/nest-modules/tasks-module/helpers/tasks-fixture';
import { TasksController } from 'src/nest-modules/tasks-module/tasks.controller';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';

describe('TasksController (e2e)', () => {
  describe('/tasks (GET)', () => {
    describe('should return tasks sorted by created_at when request query is empty', () => {
      let taskseRepo: ITasksRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } =
        ListTasksFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        taskseRepo = nestApp.app.get<ITasksRepository>(
          TasksProviders.REPOSITORIES.TASKS_REPOSITORY.provide,
        );
        await taskseRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/tasks/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  TasksController.serialize(TasksMapper.toOutput(e)),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
