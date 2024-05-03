import { Entity } from "../../domain/entities/entity";
import { NotFoundError } from "../../domain/errors/not-found.error";
import { Uuid } from "../../domain/value-objects/uuid-value-object";
import { InMemoryRepository } from "./in-memory.repository";


type StubEntityConstructor = {
  entityId?: Uuid;
  name: string;
  value: number;
};

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  value: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entityId = props.entityId || new Uuid();
    this.name = props.name;
  }

  toJson() {
    return {
      entityId: this.entityId.id,
      name: this.name,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test("should insert a new entity", async () => {
    const entity = new StubEntity({
      entityId: new Uuid(),
      name: "Test",
      value: 100,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
  });

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({
        entityId: new Uuid(),
        name: "Test",
        value: 100,
      }),
      new StubEntity({
        entityId: new Uuid(),
        name: "Test",
        value: 100,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  it("should returns all entities", async () => {
    const entity = new StubEntity({ name: "name value", value: 5 });
    await repo.insert(entity);

    const entities = await repo.findAll();

    expect(entities).toStrictEqual([entity]);
  });

  it("should throws error on update when entity not found", async () => {
    const entity = new StubEntity({ name: "name value", value: 5 });
    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entityId, StubEntity)
    );
  });

  it("should updates an entity", async () => {
    const entity = new StubEntity({ name: "name value", value: 5 });
    await repo.insert(entity);

    const entityUpdated = new StubEntity({
      entityId: entity.entityId,
      name: "updated",
      value: 1,
    });
    await repo.update(entityUpdated);
    expect(entityUpdated.toJson()).toStrictEqual(repo.items[0].toJson());
  });

  it("should throws error on delete when entity not found", async () => {
    const uuid = new Uuid();
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity)
    );

    await expect(
      repo.delete(new Uuid("9366b7dc-2d71-4799-b91c-c64adb205104"))
    ).rejects.toThrow(
      new NotFoundError("9366b7dc-2d71-4799-b91c-c64adb205104", StubEntity)
    );
  });

  it("should deletes an entity", async () => {
    const entity = new StubEntity({ name: "name value", value: 5 });
    await repo.insert(entity);

    await repo.delete(entity.entityId);
    expect(repo.items).toHaveLength(0);
  });
});
