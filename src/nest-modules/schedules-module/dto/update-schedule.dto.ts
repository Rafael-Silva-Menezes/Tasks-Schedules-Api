import { UpdateScheduleInput } from '@core/schedules/application/usecases/update-usecase/update-schedule.input';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateScheduleInputWithoutId extends OmitType(
  UpdateScheduleInput,
  ['id'] as const,
) {}

export class UpdateScheduleDto extends UpdateScheduleInputWithoutId {}
