import { IUseCase } from "../../../shared/application/use-case.interfce";

export type DeleteScheduleInput = {id:string}

export type DeleteScheduleOutput = void;

export interface IDeleteScheduleUseCase 
extends IUseCase<DeleteScheduleInput, DeleteScheduleOutput>{}