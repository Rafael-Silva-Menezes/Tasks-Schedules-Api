import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";
import { IScheduleRepository } from "../../domain/interfaces/schedule.repository";
import { ScheduleMapper } from "../common/schedule.use-case.mapper";
import { GetScheduleInput, GetScheduleOutput, IGetScheduleUseCase } from "./get-schedule.use-case.interface";

export class GetScheduleUseCase
  implements IGetScheduleUseCase
{
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
