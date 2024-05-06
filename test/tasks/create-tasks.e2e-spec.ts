import request from 'supertest';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import * as TasksProvider from 'src/nest-modules/tasks-module/tasks.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { instanceToPlain } from 'class-transformer';
import { CreateTasksFixture } from 'src/nest-modules/tasks-module/helpers/tasks-fixture';
import { TasksController } from 'src/nest-modules/tasks-module/tasks.controller';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import * as SchedulesProviders from 'src/nest-modules/schedules-module/schedules.providers';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('TasksController (e2e)', () => {
  const appHelper = startApp();
  let tasksRepo: ITasksRepository;
  let scheduleRepo: IScheduleRepository;

  beforeEach(async () => {
    tasksRepo = appHelper.app.get<ITasksRepository>(
      TasksProvider.REPOSITORIES.TASKS_REPOSITORY.provide,
    );
    scheduleRepo = appHelper.app.get<IScheduleRepository>(
      SchedulesProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    );
  });

  describe('/tasks (POST)', () => {
    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequest = CreateTasksFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each([arrange])('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/tasks')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequest =
        CreateTasksFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/tasks')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a tasks', () => {
      const arrange = CreateTasksFixture.arrangeForCreate();

      test.each(arrange)('when body is $title', async ({ send_data }) => {
        const scheduleCreated = Schedule.fake().aSchedule().build();
        await scheduleRepo.insert(scheduleCreated);
        send_data.scheduleId = scheduleCreated.getScheduleId().id;

        const res = await request(appHelper.app.getHttpServer())
          .post('/tasks')
          .send(send_data)
          .expect(201);

        const keysInResponse = CreateTasksFixture.keysInResponse;
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

        const id = res.body.data.id;
        const tasksCreated = await tasksRepo.findById(new Uuid(id));

        const presenter = TasksController.serialize(
          TasksMapper.toOutput(tasksCreated),
        );

        const serialized = instanceToPlain(presenter);
        expect(res.body.data).toStrictEqual(serialized);
      });
    });
  });
});
