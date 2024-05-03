import { IUseCase } from "../../../shared/application/use-case.interfce";
import { ScheduleInput, ScheduleOutput } from "../common/schedule.use-case.mapper.types";

export type CreateScheduleInput = ScheduleInput;
export type CreateScheduleOutput = ScheduleOutput;

export interface ICreateScheduleUseCase 
extends IUseCase<CreateScheduleInput, CreateScheduleOutput>{}