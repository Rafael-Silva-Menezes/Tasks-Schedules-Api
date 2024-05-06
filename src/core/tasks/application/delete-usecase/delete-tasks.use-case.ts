import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  DeleteTasksInput,
  DeleteTasksOutput,
  IDeleteTasksUseCase,
} from './delete-tasks.use-case.interface';
import { ITasksRepository } from '@core/tasks/domain/interfaces/tasks.repository';

export class DeleteTasksUseCase implements IDeleteTasksUseCase {
  constructor(private readonly tasksRepository: ITasksRepository) {}

  async execute(input: DeleteTasksInput): Promise<DeleteTasksOutput> {
    const tasksId = new Uuid(input.id);
    await this.tasksRepository.delete(tasksId);
  }
}
