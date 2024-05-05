import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import * as ScheduleProviders from '../../src/nest-modules/schedules-module/schedules.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { GetScheduleFixture } from 'src/nest-modules/schedules-module/helpers/schedules-fixture';
import { SchedulesController } from 'src/nest-modules/schedules-module/schedules.controller';
import { ScheduleMapper } from '@core/schedules/application/usecases/common/schedule.use-case.mapper';

describe('SchedulesController (e2e)', () => {
  const nestApp = startApp();
  describe('/schedules/:id (GET)', () => {
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            message:
              'Schedule Not Found using ID 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
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
          .get(`/schedules/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should return a schedule ', async () => {
      const scheduleRpeo = nestApp.app.get<IScheduleRepository>(
        ScheduleProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
      );
      const schedule = Schedule.fake().aSchedule().build();
      await scheduleRpeo.insert(schedule);

      const res = await request(nestApp.app.getHttpServer())
        .get(`/schedules/${schedule.getScheduleId().id}`)
        .expect(200);
      const keyInResponse = GetScheduleFixture.keysInResponse;
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(keyInResponse);

      const presenter = SchedulesController.serialize(
        ScheduleMapper.toOutput(schedule),
      );
      const serialized = instanceToPlain(presenter);
      expect(res.body.data).toStrictEqual(serialized);
    });
  });
});
