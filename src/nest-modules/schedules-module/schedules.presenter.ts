import { ScheduleOutput } from '@core/schedules/application/usecases/common/schedule.use-case.mapper.types';
import { ListSchedulesOutput } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case.interface';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from '../shared-module/collection.presenter';

export class SchedulePresenter {
  id: string;
  accountId: string;
  agentId: string | null;
  @Transform(({ value }) => new Date(value).toISOString())
  startTime: Date | null;
  @Transform(({ value }) => new Date(value).toISOString())
  endTime: Date | null;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  createdAt: Date;

  constructor(output: ScheduleOutput) {
    this.id = output.id;
    this.accountId = output.accountId;
    this.agentId = output.agentId;
    this.startTime = output.startTime;
    this.endTime = output.endTime;
    this.createdAt = output.createdAt;
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
