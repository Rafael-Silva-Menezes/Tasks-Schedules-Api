import { ListSchedulesInput } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case.interface';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { ApiProperty } from '@nestjs/swagger';

export class SearchSchedulesDto implements ListSchedulesInput {
  @ApiProperty({
    description: 'The page number for pagination.',
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'The number of tasks to return per page.',
    required: false,
  })
  per_page?: number;

  @ApiProperty({
    description: 'The field to sort the tasks by.',
    required: false,
  })
  sort?: string;

  @ApiProperty({
    description: 'The sort direction for the sorting field.',
    required: false,
  })
  sort_dir?: SortDirection;

  @ApiProperty({
    description: 'The filter to apply to the tasks.',
    required: false,
  })
  filter?: string;
}
