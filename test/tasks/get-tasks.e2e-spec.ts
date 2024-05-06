import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import * as TasksProviders from '../../src/nest-modules/tasks-module/tasks.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { GetTasksFixture } from 'src/nest-modules/tasks-module/helpers/tasks-fixture';
import { TasksController } from 'src/nest-modules/tasks-module/tasks.controller';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import * as SchedulesProviders from 'src/nest-modules/schedules-module/schedules.providers';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('TasksController (e2e)', () => {
  const nestApp = startApp();
  describe('/tasks/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Tasks Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(nestApp.app.getHttpServer())
          .get(`/tasks/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a tasks', async () => {
      const tasksRepo = nestApp.app.get<ITasksRepository>(
        TasksProviders.REPOSITORIES.TASKS_REPOSITORY.provide,
      );
      const scheduleRepo = nestApp.app.get<IScheduleRepository>(
        SchedulesProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
      );

      const scheduleCreated = Schedule.fake().aSchedule().build();
      await scheduleRepo.insert(scheduleCreated);

      const tasks = Tasks.fake()
        .aTasks()
        .withScheduleId(scheduleCreated.getScheduleId())
        .build();
      await tasksRepo.insert(tasks);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/tasks/${tasks.getTasksId().id}`)
        .expect(200);
      const keyInResponse = GetTasksFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = TasksController.serialize(TasksMapper.toOutput(tasks));
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
