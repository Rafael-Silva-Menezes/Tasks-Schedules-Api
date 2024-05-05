import request from 'supertest';
import * as ScheduleProviders from '../../src/nest-modules/schedules-module/schedules.providers';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';

describe('SchedulesController (e2e)', () => {
  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
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
        return request(appHelper.app.getHttpServer())
          .delete(`/schedules/${id}`)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a schedule response with status 204', async () => {
      const scheduleRepo = appHelper.app.get<IScheduleRepository>(
        ScheduleProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
      );
      const schedule = Schedule.fake().aSchedule().build();
      await scheduleRepo.insert(schedule);

      await request(appHelper.app.getHttpServer())
        .delete(`/schedules/${schedule.getScheduleId().id}`)
        .expect(204);

      await expect(
        scheduleRepo.findById(schedule.getScheduleId()),
      ).resolves.toBeNull();
    });
  });
});
