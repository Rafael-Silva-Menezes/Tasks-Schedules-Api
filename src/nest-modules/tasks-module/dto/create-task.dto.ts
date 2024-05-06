import { CreateTasksInput } from '@core/tasks/application/create-usecase/create-tasks.input';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTasksDto implements CreateTasksInput {
  @ApiProperty({
    description:
      'The UUID of the account associated with the task. This is the account of the task creator.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  accountId: string;

  @ApiProperty({
    description: 'The duration of the task in minutes.',
    example: 60,
  })
  duration?: number;

  @ApiProperty({
    description:
      'The UUID of the schedule associated with the task. This is the schedule to which the task belongs.',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  scheduleId: string;

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
  type: TasksType;
}
