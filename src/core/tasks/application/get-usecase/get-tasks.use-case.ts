import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';
import { TasksMapper } from '../common/tasks.use-case.mapper';
import {
  IGetTasksUseCase,
  GetTasksInput,
  GetTasksOutput,
} from './get-tasks.use-case.interface';

export class GetTasksUseCase implements IGetTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(input: GetTasksInput): Promise<GetTasksOutput> {
    const uuid = new Uuid(input.id);
    const tasks = await this.tasksRepository.findById(uuid);
    if (!tasks) {
      throw new NotFoundError(input.id, Tasks);
    }

    return TasksMapper.toOutput(tasks);
  }
}
