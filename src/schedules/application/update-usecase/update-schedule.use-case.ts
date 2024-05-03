import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";
import { IScheduleRepository } from "../../domain/interfaces/schedule.repository";
import { ScheduleMapper } from "../common/schedule.use-case.mapper";
import { IUpdateScheduleUseCase, UpdateScheduleInput, UpdateScheduleOutput } from "./update-schedule.use-case.interface";

export class UpdateScheduleUseCase 
implements IUpdateScheduleUseCase {
 constructor(private readonly scheduleRepository: IScheduleRepository){}

 async execute(input: UpdateScheduleInput): Promise<UpdateScheduleOutput> {
     const scheduleId = new Uuid(input.id);
     const schedule = await this.scheduleRepository.findById(scheduleId);

     if(!schedule){
      throw new NotFoundError(scheduleId.id, Schedule);
     }

     input.agentId && schedule.setResponsibleAgent(new Uuid(input.agentId));
     input.startTime && schedule.setStartTime(input.startTime);
     input.endTime && schedule.setEndTime(input.endTime);
     
     await this.scheduleRepository.update(schedule);

     return ScheduleMapper.toOutput(schedule);
 }
}