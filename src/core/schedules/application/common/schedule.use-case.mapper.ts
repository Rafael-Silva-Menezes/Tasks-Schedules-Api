import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  ScheduleInput,
  ScheduleOutput,
} from './schedule.use-case.mapper.types';

export class ScheduleMapper {
  static toEntity(input: ScheduleInput): Schedule {
    const schedule = Schedule.create({
      accountId: new Uuid(input.accountId),
      agentId: new Uuid(input.agentId),
      startTime: input.startTime,
      endTime: input.endTime,
    });
    return schedule;
  }

  static toOutput(entity: Schedule): ScheduleOutput {
    const { scheduleId, accountId, agentId, ...otherProps } = entity.toJson();
    return {
      id: scheduleId,
      accountId: accountId,
      agentId: agentId,
      ...otherProps,
    };
  }
}
