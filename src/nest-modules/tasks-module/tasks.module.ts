import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TASKS_PROVIDERS } from './tasks.providers';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { SchedulesModule } from '../schedules-module/schedules.module';

@Module({
  imports: [
    SequelizeModule.forFeature([TasksModel, ScheduleModel]),
    SchedulesModule,
  ],
  controllers: [TasksController],
  providers: [
    ...Object.values(TASKS_PROVIDERS.REPOSITORIES),
    ...Object.values(TASKS_PROVIDERS.USE_CASES),
  ],
})
export class TasksModule {}
