import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { setupSequelize } from "../../../shared/infra/testing/helpers";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleInMemoryRepository } from "../../infra/db/in-memory/schedule-in-memory.repository";
import { ScheduleModel } from "../../infra/db/sequelize/model/schedule.model";
import { ScheduleSequelizeRepository } from "../../infra/db/sequelize/repository/schedule-sequelize.repository";
import { GetScheduleUseCase } from "./get-schedule.use-case";


describe("GetScheduleUseCase Unit Tests", () => {
  let useCase: GetScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new GetScheduleUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError()
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Schedule)
    );
  });

  it("should returns a category", async () => {
    const accountId = new Uuid();
    const agentId = new Uuid();
    const startTime = new Date();
    const endTime = new Date();

    const items = [Schedule.create({ accountId,agentId,startTime,endTime })];
    repository.items = items;
    
    const spyFindById = jest.spyOn(repository, "findById");
    const output = await useCase.execute({ id: items[0].getScheduleId().id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].getScheduleId().id,
      accountId: items[0].getAccountId().id,
      agentId: items[0].getAgentId().id,
      startTime: items[0].getStartTime(),
      endTime: items[0].getEndTime(),
      createdAt: items[0].getCreatedAt(),
    });
  });
});
