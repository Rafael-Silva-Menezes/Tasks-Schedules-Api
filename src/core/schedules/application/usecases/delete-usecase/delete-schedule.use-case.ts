import { IScheduleRepository } from '@core/schedules/domain/interfaces/schedule.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import {
  IDeleteScheduleUseCase,
  DeleteScheduleInput,
  DeleteScheduleOutput,
} from './delete-schedule.use-case.interface';

export class DeleteScheduleUseCase implements IDeleteScheduleUseCase {
  constructor(private readonly scheduleRepository: IScheduleRepository) {}

  async execute(input: DeleteScheduleInput): Promise<DeleteScheduleOutput> {
    const scheduleId = new Uuid(input.id);
    await this.scheduleRepository.delete(scheduleId);
  }
}
