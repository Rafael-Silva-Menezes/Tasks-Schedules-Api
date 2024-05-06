import { IUseCase } from '@core/shared/application/use-case.interfce';

export type DeleteTasksInput = { id: string };

export type DeleteTasksOutput = void;

export interface IDeleteTasksUseCase
  extends IUseCase<DeleteTasksInput, DeleteTasksOutput> {}
