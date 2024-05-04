import {
  IsNotEmpty,
  IsOptional,
  IsDate,
  validateSync,
  IsUUID,
} from 'class-validator';
import { ScheduleInput } from '../common/schedule.use-case.mapper.types';

export type CreateScheduleInputConstructorProps = ScheduleInput;

export class CreateScheduleInput {
  @IsUUID()
  @IsNotEmpty()
  accountId: string;

  @IsUUID()
  @IsOptional()
  agentId?: string;

  @IsDate()
  @IsOptional()
  startTime?: Date;

  @IsDate()
  @IsOptional()
  endTime?: Date;

  constructor(props: CreateScheduleInputConstructorProps) {
    if (!props) return;
    this.accountId = props.accountId;
    this.agentId = props.agentId;
    this.endTime = props.endTime;
    this.startTime = props.startTime;
  }
}

export class ValidateCreateScheduleInput {
  static validate(input: CreateScheduleInput) {
    return validateSync(input);
  }
}
