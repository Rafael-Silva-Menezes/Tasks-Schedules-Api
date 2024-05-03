import { IUseCase } from "../../../shared/application/use-case.interfce";
import { ScheduleOutput } from "../common/schedule.use-case.mapper.types";
import { CreateScheduleInput } from "./create-schedule.input";

export type CreateScheduleOutput = ScheduleOutput;

export interface ICreateScheduleUseCase 
extends IUseCase<CreateScheduleInput, CreateScheduleOutput>{}