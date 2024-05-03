import { Schedule } from "@core/schedules/domain/entities/schedule.entity";
import { ScheduleSearchParams, ScheduleSearchResult } from "@core/schedules/domain/interfaces/schedule.repository";
import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { setupSequelize } from "@core/shared/infra/testing/helpers";
import { ScheduleModelMapper } from "../model/schedule-mapper.model";
import { ScheduleModel } from "../model/schedule.model";
import { ScheduleSequelizeRepository } from "./schedule-sequelize.repository";
import { NotFoundError } from "@core/shared/domain/errors/not-found.error";

describe("ScheduleSequelizeRepository Integration Tests", () => {
  let repository: ScheduleSequelizeRepository;
  setupSequelize({ models: [ScheduleModel] });


  beforeEach(async () => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
  });

  describe("CRUD operations in database", () => {
 it("Should insert a new entity", async () => { 
   let schedule = Schedule.fake().aSchedule().build();
   await repository.insert(schedule);
   let entity = await repository.findById(schedule.getScheduleId());
   expect(entity.toJson()).toStrictEqual(schedule.toJson());
 });

 it("should finds a entity by id", async () => {
  let entityFound = await repository.findById(new Uuid());
  expect(entityFound).toBeNull();

  const entity = Schedule.fake().aSchedule().build();
  await repository.insert(entity);
  entityFound = await repository.findById(entity.getScheduleId());
  expect(entity.toJson()).toStrictEqual(entityFound.toJson());
});

it("should return all schedules", async () => {
  const entity = Schedule.fake().aSchedule().build();
  await repository.insert(entity);
  const entities = await repository.findAll();
  expect(entities).toHaveLength(1);
  expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
});

it("should throw error on update when a entity not found", async () => {
  const entity = Schedule.fake().aSchedule().build();
  await expect(repository.update(entity)).rejects.toThrow(
    new NotFoundError(entity.getScheduleId().id, Schedule)
  );
});

it("should update a entity", async () => {
  const entity = Schedule.fake().aSchedule().build();
  await repository.insert(entity);

  entity.setResponsibleAgent(new Uuid());
  await repository.update(entity);

  const entityFound = await repository.findById(entity.getScheduleId());
  expect(entity.toJson()).toStrictEqual(entityFound.toJson());
});

it("should throw error on delete when a entity not found", async () => {
  const scheduleId = new Uuid();
  await expect(repository.delete(scheduleId)).rejects.toThrow(
    new NotFoundError(scheduleId.id, Schedule)
  );
});

it("should delete a entity", async () => {
  const entity = new Schedule({ scheduleId: new Uuid(), accountId: new Uuid(), agentId: new Uuid() });
  await repository.insert(entity);

  await repository.delete(entity.getScheduleId());
  await expect(repository.findById(entity.getScheduleId())).resolves.toBeNull();
});
  });

  describe("search method tests", () => {
    it("should only apply paginate when other params are null", async () => {
      const createdAt = new Date();
      const agentId = new Uuid();
      const accountId = new Uuid();

      const categories = Schedule.fake()
        .theSchedules(16)
        .withAgentId(agentId)
        .withAccountId(accountId)
        .withCreatedAt(createdAt)
        .build();
      await repository.bulkInsert(categories);
      const spyToEntity = jest.spyOn(ScheduleModelMapper, "toEntity");

      const searchOutput = await repository.search(new ScheduleSearchParams());
      expect(searchOutput).toBeInstanceOf(ScheduleSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(Schedule);
        expect(item.getAccountId()).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJson());
      expect(items).toMatchObject(
        new Array(15).fill({
          accountId: accountId.id,
          agentId: agentId.id,
          createdAt,
        })
      );
    });

    it("should order by createdAt DESC when search params are null", async () => {
      const createdAt = new Date();
      const schedules = Schedule.fake()
        .theSchedules(16)
        .withAgentId(new Uuid())
        .withCreatedAt((index) => new Date(createdAt.getTime() + index))
        .build();
      const searchOutput = await repository.search(new ScheduleSearchParams());
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(item.getCreatedAt()).toBe(schedules[index + 1].getCreatedAt());
      });
    });
    
    //TODO - Implements tests to pagination and sort when receive filters
  });
})

