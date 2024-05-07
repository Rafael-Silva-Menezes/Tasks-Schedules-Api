import { UpdateScheduleInput } from '@core/schedules/application/usecases/update-usecase/update-schedule.input';
import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleInputWithoutId extends OmitType(
  UpdateScheduleInput,
  ['id'] as const,
) {}

export class UpdateScheduleDto extends UpdateScheduleInputWithoutId {
  @ApiProperty({
    description:
      'The UUID of the agent assigned to the schedule. This field is optional.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  agentId?: string;

  @ApiProperty({
    description: 'The end time of the schedule.',
    example: '2024-05-06T12:00:00Z',
  })
  endTime?: Date;

  @ApiProperty({
    description: 'The start time of the schedule.',
    example: '2024-05-06T08:00:00Z',
  })
  startTime?: Date;
}
