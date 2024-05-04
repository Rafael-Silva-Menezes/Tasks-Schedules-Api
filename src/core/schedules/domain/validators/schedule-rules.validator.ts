import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  IsUUID,
  IsNotEmpty,
  IsOptional,
  IsDate,
  Validate,
} from 'class-validator';
import { Schedule } from '../entities/schedule.entity';
import { IsValidEndTimeConstraint } from './schedule-endTime.validator';

export class ScheduleRules {
  @IsUUID()
  @IsNotEmpty({ groups: ['scheduleId'] })
  scheduleId: Uuid;

  @IsUUID()
  @IsNotEmpty({ groups: ['accountId'] })
  accountId: Uuid;

  @IsUUID()
  @IsOptional({ groups: ['agentId'] })
  agentId: Uuid | null;

  @IsDate({ groups: ['startTime'] })
  @IsOptional()
  startTime: Date | null;

  @IsDate()
  @IsOptional()
  @Validate(IsValidEndTimeConstraint, { groups: ['endTime'] })
  endTime: Date | null;

  constructor(schedule: Schedule) {
    Object.assign(this, schedule);
  }
}
