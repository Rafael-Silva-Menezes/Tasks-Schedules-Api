import { TasksOutput } from '@core/tasks/application/common/tasks.use-case.mapper.types';

export type ScheduleInput = {
  accountId: string;
  agentId?: string;
  startTime?: Date;
  endTime?: Date;
};

export type ScheduleOutput = {
  id: string;
  accountId: string;
  agentId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
  tasks?: TasksOutput[];
};
