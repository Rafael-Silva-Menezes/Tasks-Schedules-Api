import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleInMemoryRepository } from "../../infra/db/in-memory/schedule-in-memory.repository";
import { DeleteScheduleUseCase } from "./delete-schedule.use-case";

describe("DeleteScheduleUseCase Unit Tests", () => {
  let useCase: DeleteScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new DeleteScheduleUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id"})
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id})
    ).rejects.toThrow(new NotFoundError(uuid.id, Schedule));
  });

  it("should delete a schedule", async () => {
    const items = [new Schedule({ accountId: new Uuid() })];
    repository.items = items;
    await useCase.execute({
      id: items[0].getScheduleId().id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
