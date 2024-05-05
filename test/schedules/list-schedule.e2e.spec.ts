import request from 'supertest';
import { instanceToPlain } from 'class-transformer';
import * as ScheduleProviders from '../../src/nest-modules/schedules-module/schedules.providers';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { ListSchedulesFixture } from 'src/nest-modules/schedules-module/helpers/schedules-fixture';
import { startApp } from 'src/nest-modules/shared-module/helpers/helpers';
import { SchedulesController } from 'src/nest-modules/schedules-module/schedules.controller';
import { ScheduleMapper } from '@core/schedules/application/usecases/common/schedule.use-case.mapper';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';

describe('SchedulesController (e2e)', () => {
  describe('/schedules (GET)', () => {
    describe('should return schedules sorted by created_at when request query is empty', () => {
      let scheduleRepo: IScheduleRepository;
      const nestApp = startApp();
      const { entitiesMap, arrange } =
        ListSchedulesFixture.arrangeIncrementedWithCreatedAt();

      beforeEach(async () => {
        scheduleRepo = nestApp.app.get<IScheduleRepository>(
          ScheduleProviders.REPOSITORIES.SCHEDULE_REPOSITORY.provide,
        );
        await scheduleRepo.bulkInsert(Object.values(entitiesMap));
      });

      test.each(arrange)(
        'when query params is $send_data',
        async ({ send_data, expected }) => {
          const queryParams = new URLSearchParams(send_data as any).toString();
          return request(nestApp.app.getHttpServer())
            .get(`/schedules/?${queryParams}`)
            .expect(200)
            .expect({
              data: expected.entities.map((e) =>
                instanceToPlain(
                  SchedulesController.serialize(ScheduleMapper.toOutput(e)),
                ),
              ),
              meta: expected.meta,
            });
        },
      );
    });
  });
});
