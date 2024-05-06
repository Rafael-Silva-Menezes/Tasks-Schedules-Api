import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';

export enum TasksType {
  BREAK = 'break',
  WORK = 'work',
}
export type TasksConstructorProps = {
  tasksId?: Uuid;
  scheduleId: Uuid;
  accountId: Uuid;
  startTime?: Date;
  duration?: number;
  type: TasksType;
  createdAt?: Date;
};

export type TasksCreateCommand = TasksConstructorProps;
