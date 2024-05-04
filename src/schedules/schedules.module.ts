import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '@core/schedules/infra/db/sequelize/repository/schedule-sequelize.repository';

@Module({
  imports: [SequelizeModule.forFeature([ScheduleModel])],
  controllers: [SchedulesController],
  providers: [
    {
      provide: ScheduleSequelizeRepository,
      useFactory: (scheduleModel: typeof ScheduleModel) =>
        new ScheduleSequelizeRepository(scheduleModel),
      inject: [getModelToken(ScheduleModel)],
    },
  ],
})
export class SchedulesModule {}
