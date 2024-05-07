import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import * as TasksProviders from '../../src/nest-modules/tasks-module/tasks.providers';
import * as SchedulesProviders from '../../src/nest-modules/schedules-module/schedules.providers';

import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import request from 'supertest';
import { UpdateTasksFixture } from 'src/nest-modules/tasks-module/helpers/tasks-fixture';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { TasksController } from 'src/nest-modules/tasks-module/tasks.controller';
import { instanceToPlain } from 'class-transformer';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('TasksController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/tasks/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { duration: 1000 },
          expected: {
            message:
              'Tasks Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { scheduleId: 'invalid_id' },
          expected: {
            statusCode: 422,
            message: ['scheduleId must be a UUID'],
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/tasks/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateTasksFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/tasks/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a tasks', () => {
      const appHelper = startApp();
      const arrange = UpdateTasksFixture.arrangeForUpdate();
      let tasksRepo: ITasksRepository;
      let scheduleRepo: IScheduleRepository;

      beforeEach(async () => {
        tasksRepo = appHelper.app.get<ITasksRepository>(
          TasksProviders.REPOSITORIES.TASKS_REPOSITORY.provide,
        );
        scheduleRepo = appHelper.app.get<IScheduleRepository>(
          SchedulesProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
        );
      });
      test.each(arrange)('when body is $send_data', async ({ send_data }) => {
        const scheduleCreated = Schedule.fake().aSchedule().build();
        await scheduleRepo.insert(scheduleCreated);

        const tasksCreated = Tasks.fake()
          .aTasks()
          .withScheduleId(scheduleCreated.getScheduleId())
          .build();
        await tasksRepo.insert(tasksCreated);

        send_data.scheduleId = scheduleCreated.getScheduleId().id;

        const res = await request(appHelper.app.getHttpServer())
          .patch(`/tasks/${tasksCreated.getTasksId().id}`)
          .send(send_data)
          .expect(200);
        const keyInResponse = UpdateTasksFixture.keysInResponse;
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
        const id = res.body.data.id;
        const tasksUpdated = await tasksRepo.findById(new Uuid(id));
        const presenter = TasksController.serialize(
          TasksMapper.toOutput(tasksUpdated),
        );
        const serialized = instanceToPlain(presenter);
        expect(res.body.data).toStrictEqual(serialized);
      });
    });
  });
});
