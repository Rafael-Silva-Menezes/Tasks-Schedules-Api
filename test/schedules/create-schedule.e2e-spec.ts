import request from 'supertest';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { SCHEDULE_PROVIDERS } from 'src/nest-modules/schedules-module/schedules.providers';
import { CreateScheduleFixture } from 'src/nest-modules/schedules-module/helpers/schedules-fixture';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { SchedulesController } from 'src/nest-modules/schedules-module/schedules.controller';
import { ScheduleMapper } from '@core/schedules/application/usecases/common/schedule.use-case.mapper';
import { instanceToPlain } from 'class-transformer';

describe('SchedulesController (e2e)', () => {
  const appHelper = startApp();
  let scheduleRepo: IScheduleRepository;
  beforeEach(async () => {
    scheduleRepo = appHelper.app.get<IScheduleRepository>(
      SCHEDULE_PROVIDERS.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
    );
  });

  describe('/schedules (POST)', () => {
    describe('should return a response error with 422 status code when request body is invalid', () => {
      const invalidRequest = CreateScheduleFixture.arrangeInvalidRequest();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each([arrange])('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/schedules')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should return a response error with 422 status code when throw EntityValidationError', () => {
      const invalidRequest =
        CreateScheduleFixture.arrangeForEntityValidationError();
      const arrange = Object.keys(invalidRequest).map((key) => ({
        label: key,
        value: invalidRequest[key],
      }));

      test.each(arrange)('when body is $label', ({ value }) => {
        return request(appHelper.app.getHttpServer())
          .post('/schedules')
          .send(value.send_data)
          .expect(422)
          .expect(value.expected);
      });
    });

    describe('should create a schedule', () => {
      const arrange = CreateScheduleFixture.arrangeForCreate();

      test.each(arrange)('when body is $title', async ({ send_data }) => {
        const res = await request(appHelper.app.getHttpServer())
          .post('/schedules')
          .send(send_data)
          .expect(201);

        const keysInResponse = CreateScheduleFixture.keysInResponse;
        expect(Object.keys(res.body)).toStrictEqual(['data']);
        expect(Object.keys(res.body.data)).toStrictEqual(keysInResponse);

        const id = res.body.data.id;
        const scheduleCreated = await scheduleRepo.findById(new Uuid(id));

        const presenter = SchedulesController.serialize(
          ScheduleMapper.toOutput(scheduleCreated),
        );

        const serialized = instanceToPlain(presenter);
        expect(res.body.data).toStrictEqual(serialized);
      });
    });
  });
});
