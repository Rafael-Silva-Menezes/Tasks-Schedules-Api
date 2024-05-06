import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import {
  CreateTasksOutput,
  ICreateTasksUseCase,
} from './create-tasks.use-case.interface';
import { TasksMapper } from '../common/tasks.use-case.mapper';
import { CreateTasksInput } from './create-tasks.input';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';

export class CreateTasksUseCase implements ICreateTasksUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}
  async execute(input: CreateTasksInput): Promise<CreateTasksOutput> {
    const entity = TasksMapper.toEntity(input);
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.tasksRepository.insert(entity);
    return TasksMapper.toOutput(entity);
  }
}
