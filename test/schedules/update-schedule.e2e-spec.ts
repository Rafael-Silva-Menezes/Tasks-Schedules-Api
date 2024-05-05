import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import * as ScheduleProviders from '../../src/nest-modules/schedules-module/schedules.providers';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import request from 'supertest';
import { UpdateScheduleFixture } from 'src/nest-modules/schedules-module/helpers/schedules-fixture';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { SchedulesController } from 'src/nest-modules/schedules-module/schedules.controller';
import { ScheduleMapper } from '@core/schedules/application/usecases/common/schedule.use-case.mapper';
import { instanceToPlain } from 'class-transformer';

describe('SchedulesController (e2e)', () => {
  const uuid = '9366b7dc-2d71-4799-b91c-c64adb205104';

  describe('/schedules/:id (PATCH)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const nestApp = startApp();
      const faker = Schedule.fake().aSchedule().withAgentId(new Uuid()).build();
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          send_data: { agentId: faker.getAgentId().id },
          expected: {
            message:
              'Schedule Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
            statusCode: 404,
            error: 'Not Found',
          },
        },
        {
          id: 'fake id',
          send_data: { agentId: 'invalid_id' },
          expected: {
            statusCode: 422,
            message: ['agentId must be a UUID'],
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)(
        'when id is $id',
        async ({ id, send_data, expected }) => {
          return request(nestApp.app.getHttpServer())
            .patch(`/schedules/${id}`)
            .send(send_data)
            .expect(expected.statusCode)
            .expect(expected);
        },
      );
    });

    describe('should a response error with 422 when request body is invalid', () => {
      const app = startApp();
      const invalidRequest = UpdateScheduleFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));
      test.each(arrange)('when body is $label', ({ value }) => {
        return request(app.app.getHttpServer())
          .patch(`/schedules/${uuid}`)
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should update a schedule', () => {
      const appHelper = startApp();
      const arrange = UpdateScheduleFixture.arrangeForUpdate();
      let scheduleRepo: IScheduleRepository;

      beforeEach(async () => {
        scheduleRepo = appHelper.app.get<IScheduleRepository>(
          ScheduleProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
        );
      });
      test.each(arrange)(
        'when body is $send_data',
        async ({ send_data, expected }) => {
          const scheduleCreated = Schedule.fake().aSchedule().build();
          await scheduleRepo.insert(scheduleCreated);

          const res = await request(appHelper.app.getHttpServer())
            .patch(`/schedules/${scheduleCreated.getScheduleId().id}`)
            .send(send_data)
            .expect(200);
          const keyInResponse = UpdateScheduleFixture.keysInResponse;
          expect(Object.keys(res.body)).toStrictEqual(['data']);
          expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);
          const id = res.body.data.id;
          const scheduleUpdated = await scheduleRepo.findById(new Uuid(id));
          const presenter = SchedulesController.serialize(
            ScheduleMapper.toOutput(scheduleUpdated),
          );
          const serialized = instanceToPlain(presenter);
          expect(res.body.data).toStrictEqual(serialized);
        },
      );
    });
  });
});
