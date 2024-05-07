import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import {
  CreateTasksOutput,
  ICreateTasksUseCase,
} from './create-tasks.use-case.interface';
import { TasksMapper } from '../common/tasks.use-case.mapper';
import { CreateTasksInput } from './create-tasks.input';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';

export class CreateTasksUseCase implements ICreateTasksUseCase {
  constructor(
    private readonly tasksRepository: ITasksRepository,
    private readonly scheduleRepository: IScheduleRepository,
  ) {}
  async execute(input: CreateTasksInput): Promise<CreateTasksOutput> {
    await this.validateScheduleId(input.scheduleId);
    const entity = TasksMapper.toEntity(input);

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.tasksRepository.insert(entity);
    return TasksMapper.toOutput(entity);
  }

  private async validateScheduleId(scheduleId: string): Promise<void> {
    const schedule = await this.scheduleRepository.findById(
      new Uuid(scheduleId),
    );
    if (!schedule) {
      throw new NotFoundError(scheduleId, Schedule);
    }
  }
}
