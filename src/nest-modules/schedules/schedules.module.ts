import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { SCHEDULE_PROVIDERS } from './schedules.providers';

@Module({
  imports: [SequelizeModule.forFeature([ScheduleModel])],
  controllers: [SchedulesController],
  providers: [
    ...Object.values(SCHEDULE_PROVIDERS.REPOSITORIES),
    ...Object.values(SCHEDULE_PROVIDERS.USE_CASES),
  ],
})
export class SchedulesModule {}
