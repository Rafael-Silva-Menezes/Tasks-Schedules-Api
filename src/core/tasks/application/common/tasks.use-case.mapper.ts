import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { TasksInput, TasksOutput } from './tasks.use-case.mapper.types';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

export class TasksMapper {
  static toEntity(input: TasksInput): Tasks {
    const tasks = Tasks.create({
      accountId: new Uuid(input.accountId),
      scheduleId: new Uuid(input.scheduleId),
      startTime: input.startTime,
      type: input.type,
      duration: input.duration,
    });
    return tasks;
  }

  static toOutput(entity: Tasks): TasksOutput {
    const { tasksId, ...otherProps } = entity.toJson();
    return {
      id: tasksId,
      ...otherProps,
    };
  }
}
