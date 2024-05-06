import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { InMemorySearchableRepository } from '@core/shared/infra/db/in-memory-searchable.repository';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import {
  ITasksRepository,
  TasksFilter,
} from '@core/tasks/domain/interfaces/tasks.repository';

export class TasksInMemoryRepository
  extends InMemorySearchableRepository<Tasks, Uuid>
  implements ITasksRepository
{
  sortableFields: string[] = ['createdAt'];

  getEntity(): new (...args: any[]) => Tasks {
    return Tasks;
  }

  protected async applyFilter(
    items: Tasks[],
    filter: TasksFilter,
  ): Promise<Tasks[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.getType().toLowerCase().includes(filter.toLowerCase());
    });
  }

  protected applySort(
    items: Tasks[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Tasks[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'createdAt', 'desc');
  }
}
