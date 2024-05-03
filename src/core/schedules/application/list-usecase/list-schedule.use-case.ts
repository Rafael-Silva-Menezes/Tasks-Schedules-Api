import {
  IScheduleRepository,
  ScheduleSearchParams,
} from '@core/schedules/domain/interfaces/schedule.repository';
import { PaginationOutputMapper } from '@core/shared/application/pagination-output';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import {
  IListUseCase,
  ListSchedulesInput,
  ListSchedulesOutput,
} from './list-schedule.use-case.interface';

export class ListScheduleUseCase implements IListUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(input: ListSchedulesInput): Promise<ListSchedulesOutput> {
    const params = new ScheduleSearchParams(input);
    const searchResult = await this.scheduleRepository.search(params);

    const outputItems = searchResult.items.map((item) =>
      ScheduleMapper.toOutput(item),
    );
    return PaginationOutputMapper.toOutput(outputItems, searchResult);
  }
}
