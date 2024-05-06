import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  ScheduleInput,
  ScheduleOutput,
} from './schedule.use-case.mapper.types';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksMapper } from '@core/tasks/application/common/tasks.use-case.mapper';

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
    const { scheduleId, tasks, ...otherProps } = entity.toJson();
    return {
      id: scheduleId,
      ...otherProps,
    };
  }

  static toOutputWithTasks(entity: Schedule): Required<ScheduleOutput> {
    const { scheduleId, tasks, ...otherProps } = entity.toJson();
    return {
      id: scheduleId,
      tasks: entity.getTasks().map((task) => TasksMapper.toOutput(task)),
      ...otherProps,
    };
  }
}
