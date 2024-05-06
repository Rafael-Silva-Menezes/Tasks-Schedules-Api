import { ScheduleFilter } from '@core/schedules/domain/interfaces/schedule.repository';
import { PaginationOutput } from '@core/shared/application/pagination-output';
import { IUseCase } from '@core/shared/application/use-case.interfce';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { TasksOutput } from '../common/tasks.use-case.mapper.types';

export type ListTasksInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: ScheduleFilter | null;
};

export type ListTasksOutput = PaginationOutput<TasksOutput>;
export interface IListTasksUseCase
  extends IUseCase<ListTasksInput, ListTasksOutput> {}
