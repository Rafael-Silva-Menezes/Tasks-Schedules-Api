import { IUseCase } from '@core/shared/application/use-case.interfce';
import { TasksOutput } from '../common/tasks.use-case.mapper.types';
import { CreateTasksInput } from './create-tasks.input';

export type CreateTasksOutput = TasksOutput;

export interface ICreateTasksUseCase
  extends IUseCase<CreateTasksInput, CreateTasksOutput> {}
