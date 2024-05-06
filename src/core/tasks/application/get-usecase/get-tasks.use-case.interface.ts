import { IUseCase } from '@core/shared/application/use-case.interfce';
import { TasksOutput } from '../common/tasks.use-case.mapper.types';

export type GetTasksInput = {
  id: string;
};
export type GetTasksOutput = TasksOutput;

export interface IGetTasksUseCase
  extends IUseCase<GetTasksInput, GetTasksOutput> {}
