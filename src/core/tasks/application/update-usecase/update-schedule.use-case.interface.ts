import { IUseCase } from '@core/shared/application/use-case.interfce';
import { ScheduleOutput } from '../common/schedule.use-case.mapper.types';
import { UpdateScheduleInput } from './update-schedule.input';

export type UpdateScheduleOutput = ScheduleOutput;

export interface IUpdateScheduleUseCase
  extends IUseCase<UpdateScheduleInput, UpdateScheduleOutput> {}
