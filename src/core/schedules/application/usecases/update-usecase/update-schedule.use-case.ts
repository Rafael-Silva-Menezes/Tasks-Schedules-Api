import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { EntityValidationError } from '@core/shared/domain/validators/validation.error';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { ScheduleMapper } from '../common/schedule.use-case.mapper';
import { UpdateScheduleInput } from './update-schedule.input';
import {
  IUpdateScheduleUseCase,
  UpdateScheduleOutput,
} from './update-schedule.use-case.interface';

export class UpdateScheduleUseCase implements IUpdateScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(input: UpdateScheduleInput): Promise<UpdateScheduleOutput> {
    const scheduleId = new Uuid(input.id);
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new NotFoundError(scheduleId.id, Schedule);
    }

    input.agentId && schedule.setResponsibleAgent(new Uuid(input.agentId));
    input.startTime && schedule.setStartTime(input.startTime);
    input.endTime && schedule.setEndTime(input.endTime);

    await this.scheduleRepository.update(schedule);
    if (schedule.notification.hasErrors()) {
      throw new EntityValidationError(schedule.notification.toJSON());
    }

    return ScheduleMapper.toOutput(schedule);
  }
}
