import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { setupSequelize } from "../../../shared/infra/testing/helpers";
import { Schedule } from "../../domain/entities/schedule.entity";
import { ScheduleModel } from "../../infra/db/sequelize/model/schedule.model";
import { ScheduleSequelizeRepository } from "../../infra/db/sequelize/repository/schedule-sequelize.repository";
import { DeleteScheduleUseCase } from "./delete-schedule.use-case";

describe('DeleteScheduleUseCase Integration Tests', () => {
  let useCase: DeleteScheduleUseCase;
  let repository: ScheduleSequelizeRepository;

  setupSequelize({ models: [ScheduleModel] });

  beforeEach(() => {
    repository = new ScheduleSequelizeRepository(ScheduleModel);
    useCase = new DeleteScheduleUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
   const uuid = new Uuid();
   await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
     new NotFoundError(uuid.id, Schedule)
   );
  });

  it('should delete a schedule', async () => {
   const category = Schedule.fake().aSchedule().build();
   await repository.insert(category);

   await useCase.execute({
     id: category.getScheduleId().id,
   });
   await expect(repository.findById(category.getScheduleId())).resolves.toBeNull();
});
});
