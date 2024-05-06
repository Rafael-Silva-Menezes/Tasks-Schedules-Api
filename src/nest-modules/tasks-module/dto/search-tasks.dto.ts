import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { ListTasksInput } from '@core/tasks/application/list-usecase/list-tasks.use-case.interface';

export class SearchTasksDto implements ListTasksInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
