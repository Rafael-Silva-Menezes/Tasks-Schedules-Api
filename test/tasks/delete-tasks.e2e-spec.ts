import request from 'supertest';
import * as TasksProviders from '../../src/nest-modules/tasks-module/tasks.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import * as SchedulesProviders from 'src/nest-modules/schedules-module/schedules.providers';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('TasksController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
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
        return request(appHelper.app.getHttpServer())
          .delete(`/tasks/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a tasks response with status 204', async () => {
      const tasksRepo = appHelper.app.get<ITasksRepository>(
        TasksProviders.REPOSITORIES.TASKS_REPOSITORY.provide,
      );

      const scheduleRepo = appHelper.app.get<IScheduleRepository>(
        SchedulesProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
      );
      const scheduleCreated = Schedule.fake().aSchedule().build();
      await scheduleRepo.insert(scheduleCreated);

      const tasks = Tasks.fake()
        .aTasks()
        .withScheduleId(scheduleCreated.getScheduleId())
        .build();
      await tasksRepo.insert(tasks);

      await request(appHelper.app.getHttpServer())
        .delete(`/tasks/${tasks.getTasksId().id}`)
        .expect(204);

      await expect(tasksRepo.findById(tasks.getTasksId())).resolves.toBeNull();
    });
  });
});
