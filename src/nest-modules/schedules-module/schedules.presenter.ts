import { ScheduleOutput } from '@core/schedules/application/usecases/common/schedule.use-case.mapper.types';
import { ListSchedulesOutput } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case.interface';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';
import { TasksPresenter } from '../tasks-module/tasks.presenter';

export class SchedulePresenter {
  id: string;
  accountId: string;
  agentId: string | null;
  startTime: string | null;
  endTime: string | null;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;
  tasks?: TasksPresenter[];

  constructor(output: ScheduleOutput) {
    this.id = output.id;
    this.accountId = output.accountId;
    this.agentId = output.agentId;
    this.startTime = this.transformTime(output.startTime);
    this.endTime = this.transformTime(output.endTime);
    this.createdAt = output.createdAt;
    this.tasks = output.tasks
      ? output.tasks.map((item) => new TasksPresenter(item))
      : [];
  }

  private transformTime(startTime: any) {
    return startTime && startTime instanceof Date
      ? startTime.toISOString()
      : null;
  }
}

export class ScheduleCollectionPresenter extends CollectionPresenter {
  data: SchedulePresenter[];

  constructor(output: ListSchedulesOutput) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map((item) => new SchedulePresenter(item));
  }
}
