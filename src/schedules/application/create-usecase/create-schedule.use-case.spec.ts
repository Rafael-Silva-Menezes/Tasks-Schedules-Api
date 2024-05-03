import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { ScheduleInMemoryRepository } from "../../infra/db/in-memory/schedule-in-memory.repository";
import { CreateScheduleUseCase } from "./create-schedule.use-case";

describe('CreateScheduleUseCase Unit Tests', () => {
  let useCase: CreateScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new CreateScheduleUseCase(repository);
  });

  it('should throw an error when aggregate is not valid', async () => {
    const input = {
      accountId: 'a1e8f3f0-55fb-42e4-b4cf-8d6e332b68f1',
      endTime: new Date(),
    };    
    await expect(() => useCase.execute(input)).rejects.toThrow(
      'Entity Validation Error',
    );
  });

  it('should create a schedule', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    const input1 = {
      accountId: 'a1e8f3f0-55fb-42e4-b4cf-8d6e332b68f1',
      agentId: '3bbd24a9-20d2-45b3-bd48-fde2c054d138',
      startTime: new Date(),
      endTime: new Date(),
    };
    const output1 = await useCase.execute(input1);
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output1).toMatchObject({
      accountId: input1.accountId,
      agentId: input1.agentId,
    });

    const input2 = {
      accountId: 'a1e8f3f0-55fb-42e4-b4cf-8d6e332b68f1',
      agentId: '3bbd24a9-20d2-45b3-bd48-fde2c054d138',
      startTime: new Date(),
      endTime: new Date(),
    };
    const output2 = await useCase.execute(input2);
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output2).toMatchObject({
      accountId: input2.accountId,
      agentId: input2.agentId,
    });
  });
});
