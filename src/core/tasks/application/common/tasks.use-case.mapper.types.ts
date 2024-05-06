import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

export type TasksInput = {
  accountId: string;
  scheduleId: string;
  duration?: number;
  startTime?: Date;
  type: TasksType;
};

export type TasksOutput = {
  id: string;
  accountId: string;
  scheduleId: string;
  duration: number;
  startTime: Date;
  type: string;
  createdAt: Date;
};
