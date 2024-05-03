import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleInMemoryRepository } from "../../infra/db/in-memory/schedule-in-memory.repository";
import { UpdateScheduleUseCase } from "./update-schedule.use-case";
import { UpdateScheduleInput, UpdateScheduleOutput } from "./update-schedule.use-case.interface";


describe("UpdateScheduleUseCase Unit Tests", () => {
  let useCase: UpdateScheduleUseCase;
  let repository: ScheduleInMemoryRepository;

  beforeEach(() => {
    repository = new ScheduleInMemoryRepository();
    useCase = new UpdateScheduleUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id" })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();

    await expect(() =>
      useCase.execute({ id: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, Schedule));
  });

  it("should update a category", async () => {
   const agentId = new Uuid();
   const accountId = new Uuid();
   const startTime = new Date();
   const endTime = new Date();

    const spyUpdate = jest.spyOn(repository, "update");
    const entity = new Schedule({ accountId, agentId });

    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.getScheduleId().id,
      agentId: agentId.id
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

    type Arrange = {
      input: UpdateScheduleInput
      expected: UpdateScheduleOutput;
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.getScheduleId().id,
          agentId: agentId.id,
        },
        expected: {
         id: entity.getScheduleId().id,
         accountId: entity.getAccountId().id,
         agentId: entity.getAgentId().id,
         endTime: null,
         startTime: null,
         createdAt: entity.getCreatedAt(),
        },
      },
      {
        input: {
         id: entity.getScheduleId().id,
         agentId: agentId.id,
         startTime: startTime,
        },
        expected: {
         id: entity.getScheduleId().id,
         accountId: entity.getAccountId().id,
         agentId: entity.getAgentId().id,
         startTime: entity.getStartTime(),
         endTime: null,
         createdAt: entity.getCreatedAt(),
        },
      },
      {
       input: {
        id: entity.getScheduleId().id,
        agentId: agentId.id,
        startTime: startTime,
        endTime: endTime,
       },
       expected: {
        id: entity.getScheduleId().id,
        accountId: entity.getAccountId().id,
        agentId: entity.getAgentId().id,
        startTime: entity.getStartTime(),
        endTime: entity.getEndTime(),
        createdAt: entity.getCreatedAt(),
       },
     },     
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...("agentId" in i.input && { name: i.input.agentId }),
        ...("startTime" in i.input && { description: i.input.startTime }),
        ...("endTime" in i.input && { is_active: i.input.endTime }),
      });
      expect(output).toStrictEqual({
       id: i.expected.id,
       accountId: i.expected.accountId,
       agentId: i.expected.agentId,
       startTime: i.expected.startTime,
       endTime: i.expected.endTime,
       createdAt: i.expected.createdAt,
      });
    }
  });
});
