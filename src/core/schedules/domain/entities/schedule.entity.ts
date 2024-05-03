import { Entity } from "@core/shared/domain/entities/entity";
import { ValueObject } from "@core/shared/domain/entities/value-object";
import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { ScheduleConstructorProps, ScheduleCreateCommand } from "../interfaces/schedule.types";
import { ScheduleValidatorFactory } from "../validators/schedule.validator";
import { ScheduleFakeBuilder } from "./schedule-faker.builder";

export class Schedule extends Entity {
 private scheduleId: Uuid;
 private accountId: Uuid;
 private agentId: Uuid;
 private startTime: Date;
 private endTime: Date;
 private createdAt: Date;

  constructor(props: ScheduleConstructorProps) {
  super()
  this.scheduleId = props.scheduleId|| new Uuid();
  this.accountId = props.accountId;
  this.agentId = props.agentId ?? null;
  this.startTime = props.startTime ?? null;
  this.endTime = props.endTime ?? null;
  this.createdAt= props.createdAt ?? new Date() ;
 }

 get entityId(): ValueObject {
     return this.scheduleId
 }

  static create(props: ScheduleCreateCommand): Schedule {
    const schedule = new Schedule(props);
    schedule.validate(["scheduleId","accountId", "agentId","startTime","endTime"]);
    return schedule;
  }

  validate(fields?: string[]) {
    const validator = ScheduleValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  setResponsibleAgent(agentId: Uuid): void {
    this.agentId = agentId;
    this.validate(['agentId']);
  }
  
  setStartTime(startTime: Date): void {
    this.startTime = startTime;
    this.validate(['startTime']);
}

  setEndTime(endTime: Date): void {
    this.endTime = endTime;
    this.validate(['endTime']);
  }

  getScheduleId(): Uuid{
    return this.scheduleId;
  }
  getAccountId(): Uuid{
    return this.accountId;
  }

  getAgentId(): Uuid | null{
    return this.agentId;
  }

  getStartTime(): Date | null{
    return this.startTime;
  }

  getEndTime(): Date | null{
    return this.endTime || null;
  }

  getCreatedAt(): Date{
    return this.createdAt;
  }

  static fake() {
    return ScheduleFakeBuilder;
  }


  toJson(){
 
  return {
    scheduleId: this.getScheduleId().id,
    accountId: this.getAccountId().id,
    agentId: this.getAgentId()?.id,
    startTime: this.getStartTime(),
    endTime: this.getEndTime(),
    createdAt: this.getCreatedAt(),
  }
  }
  
}
