import {
  IsNotEmpty,
  IsOptional,
  IsDate,
  validateSync,
  IsUUID,
  IsInt,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TasksInput } from '../common/tasks.use-case.mapper.types';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

export type CreateTasksInputConstructorProps = TasksInput;

export class CreateTasksInput {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsEnum(TasksType)
  @IsNotEmpty()
  type: TasksType;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;

  constructor(props: CreateTasksInputConstructorProps) {
    if (!props) return;
    this.accountId = props.accountId;
    this.scheduleId = props.scheduleId;
    this.type = props.type;
    this.duration = props.duration;
    this.startTime = props.startTime;
  }
}

export class ValidateCreateTasksInput {
  static validate(input: CreateTasksInput) {
    return validateSync(input);
  }
}
