import { Entity } from "../../../shared/domain/entities/entity";
import { ValueObject } from "../../../shared/domain/entities/value-object";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { ScheduleFakeBuilder } from "./schedule-faker.builder";
import { ScheduleConstructorProps, ScheduleCreateCommand } from "../interfaces/schedule.types";
import { ScheduleValidatorFactory } from "../validators/schedule.validator";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";

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
  this.accountId= props.accountId;
  this.agentId= props.agentId ?? null;
  this.startTime= props.startTime ?? null;
  this.endTime= props.endTime && props.startTime ? props.endTime : null;
  this.createdAt= props.createdAt ?? new Date() ;
 }

 get entityId(): ValueObject {
     return this.scheduleId
 }

  static create(props: ScheduleCreateCommand): Schedule {
    const schedule = new Schedule(props);
    Schedule.validate(schedule);
    return schedule;
  }

  static validate(entity: Schedule) {
    const validator = ScheduleValidatorFactory.create();
    const isValid = validator.validate(entity);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }

  setResponsibleAgent(agentId: Uuid): void {
    this.agentId = agentId;
    Schedule.validate(this);
  }
  
  setStartTime(startTime: Date): void {
    this.startTime = startTime;
    Schedule.validate(this);
}

  setEndTime(endTime: Date): void {
    this.endTime = endTime;
    Schedule.validate(this);
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
