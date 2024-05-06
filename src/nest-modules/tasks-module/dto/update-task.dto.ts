import { OmitType } from '@nestjs/mapped-types';
import { UpdateTasksInput } from '@core/tasks/application/update-usecase/update-tasks.input';

export class UpdateScheduleInputWithoutId extends OmitType(UpdateTasksInput, [
  'id',
] as const) {}

export class UpdateTasksDto extends UpdateScheduleInputWithoutId {}
