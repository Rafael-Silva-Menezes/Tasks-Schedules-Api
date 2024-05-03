import { IsDate, IsNotEmpty, IsOptional, IsUUID, Validate } from "class-validator";
import { Schedule } from "../../../schedules/domain/entities/schedule.entity";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { IsValidEndTimeConstraint } from "./schedule-endTime.validator";

export class ScheduleRules {
//  @IsUUID()
//  @IsNotEmpty()
//  scheduleId: Uuid;

//  @IsUUID()
//  @IsNotEmpty()
//  accountId: Uuid;

//  @IsUUID()
//  @IsOptional()
//  agentId: Uuid | null;

//  @IsDate()
//  @IsOptional()
//  startTime: Date | null;

 @IsDate()
 @IsOptional()
 @Validate(IsValidEndTimeConstraint, { groups: ['endTime'] })
 endTime: Date | null;

 constructor(schedule: Schedule){
  // const scheduleValues = {
  //   scheduleId: schedule.getScheduleId().id,
  //   accountId: schedule.getAccountId().id,
  //   agentId: schedule.getAgentId() ? schedule.getAgentId().id : null, 
  //   startTime: schedule.getStartTime(), 
  //   endTime: schedule.getEndTime()
  // }

  Object.assign(this, schedule)
 }
}