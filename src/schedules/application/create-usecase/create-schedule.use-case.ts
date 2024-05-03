import { IScheduleRepository } from "../../domain/interfaces/schedule.repository";
import { ScheduleMapper } from "../common/schedule.use-case.mapper";
import { CreateScheduleInput, CreateScheduleOutput, ICreateScheduleUseCase } from "./create-schedule.use-case.interface";


export class CreateScheduleUseCase 
implements ICreateScheduleUseCase{
 constructor(private readonly scheduleRepository: IScheduleRepository){}
 async execute(input: CreateScheduleInput): Promise<CreateScheduleOutput> {
     const entity = ScheduleMapper.toEntity(input);
     await this.scheduleRepository.insert(entity);
     return ScheduleMapper.toOutput(entity);
 }
}