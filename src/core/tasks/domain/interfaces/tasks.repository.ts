import { ISearchableRepository } from '@core/shared/domain/repository/interfaces/searchable-interface';
import { SearchParams } from '@core/shared/domain/repository/search/search-params';
import { SearchResult } from '@core/shared/domain/repository/search/search-result';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '../entities/tasks.entity';

export type TasksFilter = string;

export class TasksSearchParams extends SearchParams<TasksFilter> {}

export class TasksSearchResult extends SearchResult<Tasks> {}

export interface ITasksRepository
  extends ISearchableRepository<
    Tasks,
    Uuid,
    TasksFilter,
    TasksSearchParams,
    TasksSearchResult
  > {}
