import { IUseCase } from "../../../shared/application/use-case.interfce";
import { ScheduleInput, ScheduleOutput } from "../common/schedule.use-case.mapper.types";

export type UpdateScheduleInput = Omit<ScheduleInput, 'accountId'> & {
 id:string
};

export type UpdateScheduleOutput = ScheduleOutput;

export interface IUpdateScheduleUseCase 
extends IUseCase<UpdateScheduleInput, UpdateScheduleOutput>{}