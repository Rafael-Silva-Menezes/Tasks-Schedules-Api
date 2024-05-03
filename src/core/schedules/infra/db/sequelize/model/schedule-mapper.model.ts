import { Schedule } from "@core/schedules/domain/entities/schedule.entity";
import { EntityValidationError } from "@core/shared/domain/validators/validation.error";
import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { ScheduleModel } from "./schedule.model";

export class ScheduleModelMapper {
 static toModel(entity:Schedule): ScheduleModel {
  return ScheduleModel.build({
   scheduleId: entity.getScheduleId().id,
   accountId: entity.getAccountId().id,
   agentId: entity.getAgentId()?.id,
   startTime: entity.getStartTime(),
   endTime: entity.getEndTime(),
   createdAt: entity.getCreatedAt(),
  })
 }

 static toEntity(model:ScheduleModel): Schedule {
  const schedule =  new Schedule({
   scheduleId: new Uuid(model.scheduleId),
   accountId: new Uuid(model.accountId),
   agentId: model.agentId ? new Uuid(model.agentId) : null,
   startTime: model.startTime,
   endTime: model.endTime,
   createdAt: model.createdAt,
  })



  schedule.validate();

  if (schedule.notification.hasErrors()) {
   throw new EntityValidationError(schedule.notification.toJSON());
 }
  
  return schedule;
 }
}