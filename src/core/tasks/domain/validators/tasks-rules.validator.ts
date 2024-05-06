import { IsNotEmpty, IsEnum } from 'class-validator';
import { TasksType } from '../interfaces/tasks.types';
import { Tasks } from '../entities/tasks.entity';

export class TasksRules {
  @IsEnum(TasksType, { groups: ['type'] })
  @IsNotEmpty()
  type: TasksType;

  constructor(schedule: Tasks) {
    Object.assign(this, schedule);
  }
}
