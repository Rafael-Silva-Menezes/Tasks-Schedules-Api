import { ScheduleOutput } from '@core/schedules/application/usecases/common/schedule.use-case.mapper.types';
import { Transform } from 'class-transformer';

export class SchedulePresenter {
  id: string;
  accountId: string;
  agentId: string | null;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  startTime: Date | null;
  @Transform(({ value }: { value: Date }) => value.toISOString())
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
