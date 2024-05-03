import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";
import { IScheduleRepository } from "../../domain/interfaces/schedule.repository";
import { DeleteScheduleInput, DeleteScheduleOutput, IDeleteScheduleUseCase } from "./delete-schedule.use-case.interface";

export class DeleteScheduleUseCase 
implements IDeleteScheduleUseCase {
 constructor(private readonly scheduleRepository: IScheduleRepository){}

 async execute(input: DeleteScheduleInput): Promise<DeleteScheduleOutput> {
     const scheduleId = new Uuid(input.id);
     await this.scheduleRepository.delete(scheduleId);

 }
}