import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksModel } from './tasks.model';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';

export class TasksModelMapper {
  static toModel(entity: Tasks): TasksModel {
    return TasksModel.build({
      scheduleId: entity.getScheduleId().id,
      accountId: entity.getAccountId().id,
      tasksId: entity.getTasksId()?.id,
      type: entity.getType(),
      startTime: entity.getStartTime(),
      duration: entity.getDuration(),
      createdAt: entity.getCreatedAt(),
    });
  }

  static toEntity(model: TasksModel): Tasks {
    const tasks = new Tasks({
      scheduleId: new Uuid(model.scheduleId),
      accountId: new Uuid(model.accountId),
      tasksId: model.tasksId ? new Uuid(model.tasksId) : null,
      startTime: model.startTime,
      type: model.type,
      duration: model.duration,
      createdAt: model.createdAt,
    });

    tasks.validate();

    if (tasks.notification.hasErrors()) {
      throw new EntityValidationError(tasks.notification.toJSON());
    }

    return tasks;
  }
}
