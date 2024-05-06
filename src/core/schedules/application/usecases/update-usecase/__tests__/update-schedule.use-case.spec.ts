import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { ScheduleInMemoryRepository } from '@core/schedules/infra/db/in-memory/schedule-in-memory.repository';
import {
  InvalidUuidError,
  Uuid,
} from '@core/shared/domain/value-objects/uuid-value-object';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { UpdateScheduleUseCase } from '../update-schedule.use-case';
import { UpdateScheduleInput } from '../update-schedule.input';
import { UpdateScheduleOutput } from '../update-schedule.use-case.interface';

describe('UpdateScheduleUseCase Unit Tests', () => {
  let useCase: UpdateScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new UpdateScheduleUseCase(repository);
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

  it('should update a schedule', async () => {
    const agentId = new Uuid();
    const accountId = new Uuid();
    const startTime = new Date();
    const endTime = new Date();

    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new Schedule({ accountId, agentId });

    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.getScheduleId().id,
      agentId: agentId.id,
      accountId: accountId.id,
      createdAt: entity.getCreatedAt(),
      startTime: entity.getStartTime(),
      endTime: entity.getEndTime(),
    });
  });
});
