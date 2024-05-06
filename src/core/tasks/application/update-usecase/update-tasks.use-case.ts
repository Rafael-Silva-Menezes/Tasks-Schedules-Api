import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  IUpdateTasksUseCase,
  UpdateTasksOutput,
} from './update-tasks.use-case.interface';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { TasksMapper } from '../common/tasks.use-case.mapper';
import { UpdateTasksInput } from './update-tasks.input';

export class UpdateTasksUseCase implements IUpdateTasksUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(input: UpdateTasksInput): Promise<UpdateTasksOutput> {
    const tasksId = new Uuid(input.id);
    const tasks = await this.tasksRepository.findById(tasksId);

    if (!tasks) {
      throw new NotFoundError(tasksId.id, Tasks);
    }

    input.scheduleId && tasks.setScheduleId(new Uuid(input.scheduleId));
    input.duration && tasks.setDuration(input.duration);
    input.type && tasks.setType(input.type);
    input.startTime && tasks.setStartTime(input.startTime);

    await this.tasksRepository.update(tasks);
    if (tasks.notification.hasErrors()) {
      throw new EntityValidationError(tasks.notification.toJSON());
    }

    return TasksMapper.toOutput(tasks);
  }
}
