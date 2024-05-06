import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { SCHEDULE_PROVIDERS } from './schedules.providers';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';

@Module({
  imports: [SequelizeModule.forFeature([ScheduleModel, TasksModel])],
  controllers: [SchedulesController],
  providers: [
    ...Object.values(SCHEDULE_PROVIDERS.REPOSITORIES),
    ...Object.values(SCHEDULE_PROVIDERS.USE_CASES),
  ],
})
export class SchedulesModule {}
