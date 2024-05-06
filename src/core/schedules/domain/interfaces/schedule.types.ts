import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

export type ScheduleConstructorProps = {
  scheduleId?: Uuid;
  accountId: Uuid;
  agentId?: Uuid;
  startTime?: Date;
  endTime?: Date;
  createdAt?: Date;
  tasks?: Tasks[];
};

export type ScheduleCreateCommand = ScheduleConstructorProps;
