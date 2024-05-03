import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import { CreateScheduleInput } from './create-schedule.input';
import {
  ICreateScheduleUseCase,
  CreateScheduleOutput,
} from './create-schedule.use-case.interface';

export class CreateScheduleUseCase implements ICreateScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}
  async execute(input: CreateScheduleInput): Promise<CreateScheduleOutput> {
    const entity = ScheduleMapper.toEntity(input);
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.scheduleRepository.insert(entity);
    return ScheduleMapper.toOutput(entity);
  }
}
