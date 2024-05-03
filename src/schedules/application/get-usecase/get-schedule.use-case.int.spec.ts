import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { setupSequelize } from "../../../shared/infra/testing/helpers";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleModel } from "../../infra/db/sequelize/model/schedule.model";
import { ScheduleSequelizeRepository } from "../../infra/db/sequelize/repository/schedule-sequelize.repository";
import { GetScheduleUseCase } from "./get-schedule.use-case";

describe("GetCategoryUseCase Integration Tests", () => {
  let useCase: GetScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new GetScheduleUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Schedule)
    );
  });

  it("should returns a category", async () => {
    const schedule = Schedule.fake().aSchedule().build();
    await repository.insert(schedule);
    const output = await useCase.execute({ id: schedule.getScheduleId().id });
    expect(output).toStrictEqual({
      id: schedule.getScheduleId().id,
      accountId: schedule.getAccountId().id,
      agentId: schedule.getAgentId().id,
      startTime: schedule.getStartTime(),
      endTime: schedule.getEndTime(),
      createdAt: schedule.getCreatedAt(),
    });
  });
});
