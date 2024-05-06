import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import { TasksOutput } from '@core/tasks/application/common/tasks.use-case.mapper.types';
import { ListTasksOutput } from '@core/tasks/application/list-usecase/list-tasks.use-case.interface';

export class TasksPresenter {
  id: string;
  accountId: string;
  scheduleId: string;
  type: string;
  startTime: string | null;
  duration: number | null;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: TasksOutput) {
    this.id = output.id;
    this.accountId = output.accountId;
    this.scheduleId = output.scheduleId;
    this.type = output.type;
    this.startTime = output.startTime ? output.startTime.toISOString() : null;
    this.duration = output.duration ? output.duration : null;
    this.createdAt = output.createdAt;
  }
}

export class TasksCollectionPresenter extends CollectionPresenter {
  data: TasksPresenter[];

  constructor(output: ListTasksOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new TasksPresenter(item));
  }
}
