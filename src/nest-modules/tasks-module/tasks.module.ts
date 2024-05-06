import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { TASKS_PROVIDERS } from './tasks.providers';
import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';

@Module({
  imports: [SequelizeModule.forFeature([TasksModel])],
  controllers: [TasksController],
  providers: [
    ...Object.values(TASKS_PROVIDERS.REPOSITORIES),
    ...Object.values(TASKS_PROVIDERS.USE_CASES),
  ],
})
export class TasksModule {}
