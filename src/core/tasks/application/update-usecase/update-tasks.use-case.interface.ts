import { IUseCase } from '@core/shared/application/use-case.interfce';
import { UpdateTasksInput } from './update-tasks.input';
import { TasksOutput } from '../common/tasks.use-case.mapper.types';

export type UpdateTasksOutput = TasksOutput;

export interface IUpdateTasksUseCase
  extends IUseCase<UpdateTasksInput, UpdateTasksOutput> {}
