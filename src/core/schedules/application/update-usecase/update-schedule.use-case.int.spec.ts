import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { setupSequelize } from "../../../shared/infra/testing/helpers";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleModel } from "../../infra/db/sequelize/model/schedule.model";
import { ScheduleSequelizeRepository } from "../../infra/db/sequelize/repository/schedule-sequelize.repository";
import { UpdateScheduleUseCase } from "./update-schedule.use-case";


describe('UpdateScheduleUseCase Integration Tests', () => {
  let useCase: UpdateScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new UpdateScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const {id} = new Uuid();
    await expect(() =>
      useCase.execute({ id, })
    ).rejects.toThrow(new NotFoundError(id, Schedule));
  });

  it('should update a schedule', async () => {
    const agentId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();
    const endTime = new Date();

    const entity = Schedule.fake().aSchedule().withAccountId(accountId).build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
      startTime,
      endTime
    });

    expect(output).toStrictEqual({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
      accountId: entity.getAccountId().id,
      startTime,
      endTime,
      createdAt: entity.getCreatedAt(),
    });
});
});
