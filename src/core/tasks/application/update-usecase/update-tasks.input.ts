import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  validateSync,
} from 'class-validator';
import { IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { TasksInput } from '../common/tasks.use-case.mapper.types';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';

export type UpdateTasksInputConstructorProps = Omit<TasksInput, 'accountId'> & {
  id: string;
};

export class UpdateTasksInput {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsUUID()
  @IsOptional()
  scheduleId?: string;

  @IsEnum(TasksType)
  @IsOptional()
  type?: TasksType;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsNumber()
  @IsOptional()
  duration?: number;

  constructor(props: UpdateTasksInputConstructorProps) {
    if (!props) return;
    this.id = props.id;
    this.scheduleId = props.scheduleId;
    this.type = props.type;
    this.duration = props.duration;
    this.startTime = props.startTime;
  }
}

export class ValidateUpdateTasksInput {
  static validate(input: UpdateTasksInput) {
    return validateSync(input);
  }
}
