import { OmitType } from '@nestjs/mapped-types';
import { UpdateTasksInput } from '@core/tasks/application/update-usecase/update-tasks.input';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScheduleInputWithoutId extends OmitType(UpdateTasksInput, [
  'id',
] as const) {}

export class UpdateTasksDto implements UpdateScheduleInputWithoutId {
  @ApiProperty({
    description: 'The duration of the task in minutes.',
    example: 60,
  })
  duration?: number;

  @ApiProperty({
    description: 'The UUID of the schedule associated with the task.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  scheduleId?: string;

  @ApiProperty({
    description: 'The start time of the task.',
    example: '2024-05-06T08:00:00Z',
  })
  startTime?: Date;

  @ApiProperty({
    description: 'The type of the task. It can only be "work" or "break".',
    enum: TasksType,
    example: [TasksType.BREAK, TasksType.WORK],
  })
  type?: TasksType;
}
