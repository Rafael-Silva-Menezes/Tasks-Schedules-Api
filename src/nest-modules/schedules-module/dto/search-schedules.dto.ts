import { ListSchedulesInput } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case.interface';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';

export class SearchSchedulesDto implements ListSchedulesInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
