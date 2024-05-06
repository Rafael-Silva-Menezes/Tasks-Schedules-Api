import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { GetScheduleUseCase } from '../get-schedule.use-case';

describe('GetScheduleUseCase Unit Tests', () => {
  let useCase: GetScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new GetScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Schedule),
    );
  });

  it('should returns a schedule', async () => {
    const accountId = new Uuid();
    const agentId = new Uuid();
    const startTime = new Date();
    const endTime = new Date();

    const items = [Schedule.create({ accountId, agentId, startTime, endTime })];
    repository.items = items;

    const spyFindById = jest.spyOn(repository, 'findById');
    const output = await useCase.execute({ id: items[0].getScheduleId().id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].getScheduleId().id,
      accountId: items[0].getAccountId().id,
      agentId: items[0].getAgentId().id,
      startTime: items[0].getStartTime(),
      endTime: items[0].getEndTime(),
      createdAt: items[0].getCreatedAt(),
      tasks: [],
    });
  });
});
