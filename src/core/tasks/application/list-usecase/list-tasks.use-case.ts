import { PaginationOutputMapper } from '@core/shared/application/pagination-output';
import {
  ITasksRepository,
  TasksSearchParams,
} from '@core/tasks/domain/interfaces/tasks.repository';
import { TasksMapper } from '../common/tasks.use-case.mapper';
import {
  IListTasksUseCase,
  ListTasksInput,
  ListTasksOutput,
} from './list-tasks.use-case.interface';

export class ListTasksUseCase implements IListTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(input: ListTasksInput): Promise<ListTasksOutput> {
    const params = new TasksSearchParams(input);
    const searchResult = await this.tasksRepository.search(params);

    const outputItems = searchResult.items.map((item) =>
      TasksMapper.toOutput(item),
    );
    return PaginationOutputMapper.toOutput(outputItems, searchResult);
  }
}
