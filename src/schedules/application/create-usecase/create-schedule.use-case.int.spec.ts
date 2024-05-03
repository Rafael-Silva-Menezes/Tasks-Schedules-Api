import { v4 as uuidv4 } from 'uuid';
import { Uuid } from '../../../shared/domain/value-objects/uuid-value-object';
import { setupSequelize } from '../../../shared/infra/testing/helpers';
import { ScheduleModel } from '../../infra/db/sequelize/model/schedule.model';
import { ScheduleSequelizeRepository } from '../../infra/db/sequelize/repository/schedule-sequelize.repository';
import { CreateScheduleUseCase } from './create-schedule.use-case';

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new CreateScheduleUseCase(repository);
  });

  it("should create a schedule", async () => {
    const accountId = uuidv4();
    let output = await useCase.execute({ accountId, startTime: new Date(), endTime: new Date()});
    let entity = await repository.findById(new Uuid(output.id));
    
    expect(output).toStrictEqual({
      accountId,
      id: entity.getScheduleId().id,
      agentId: entity.getAgentId()?.id,
      startTime: entity.getStartTime(),
      endTime: entity.getEndTime(),
      createdAt: entity.getCreatedAt(),
    });

    const agentId = uuidv4();
    const startTime = new Date("2024-05-10T08:00:00Z");
    const endTime = new Date("2024-06-10T09:00:00Z");
    output = await useCase.execute({
      accountId,
      agentId,
      startTime,
      endTime,
    });
    entity = await repository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      accountId,
      agentId,
      startTime,
      endTime,
      id: entity.getScheduleId().id,
      createdAt: entity.getCreatedAt(),
    });
  });
});
