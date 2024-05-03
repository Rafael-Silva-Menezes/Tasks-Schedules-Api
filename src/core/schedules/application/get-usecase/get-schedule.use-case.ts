import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import {
  IGetScheduleUseCase,
  GetScheduleInput,
  GetScheduleOutput,
} from './get-schedule.use-case.interface';

export class GetScheduleUseCase implements IGetScheduleUseCase {
  constructor(private scheduleRepository: IScheduleRepository) {}

  async execute(input: GetScheduleInput): Promise<GetScheduleOutput> {
    const uuid = new Uuid(input.id);
    const schedule = await this.scheduleRepository.findById(uuid);
    if (!schedule) {
      throw new NotFoundError(input.id, Schedule);
    }

    return ScheduleMapper.toOutput(schedule);
  }
}
