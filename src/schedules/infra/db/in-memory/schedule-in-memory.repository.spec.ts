import { Uuid } from "../../../../shared/domain/value-objects/uuid-value-object";
import { ScheduleFakeBuilder } from "../../../domain/entities/schedule-faker.builder";
import { ScheduleInMemoryRepository } from "./schedule-in-memory.repository";

describe("ScheduleInMemoryRepository", () => {
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => (repository = new ScheduleInMemoryRepository()));

  it("should no filter items when filter object is null", async () => {
    const items = [ScheduleFakeBuilder.aSchedule().build()];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items by agentId or accountId using filter parameter", async () => {
    const accountIdFilter = new Uuid();
    const agentIdFilter = new Uuid();
    const items = [
      ScheduleFakeBuilder.aSchedule().withAccountId(accountIdFilter).withAgentId(agentIdFilter).build(),
      ScheduleFakeBuilder.aSchedule().withAccountId(accountIdFilter).withAgentId(agentIdFilter).build(),
      ScheduleFakeBuilder.aSchedule().build(),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    const itemsFiltered = await repository["applyFilter"](items, accountIdFilter.id);
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

});
