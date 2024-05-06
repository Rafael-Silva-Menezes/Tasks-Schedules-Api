import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import { ListTasksInput } from '@core/tasks/application/list-usecase/list-tasks.use-case.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTasksDto implements ListTasksInput {
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
