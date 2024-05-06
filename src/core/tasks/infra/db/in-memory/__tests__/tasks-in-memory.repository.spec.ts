import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { TasksInMemoryRepository } from '../tasks-in-memory.repository';
import { TasksFakeBuilder } from '@core/tasks/domain/entities/tasks-faker.builder';

describe('ScheduleInMemoryRepository', () => {
  let repository: TasksInMemoryRepository;

  beforeEach(() => (repository = new TasksInMemoryRepository()));

  it('should no filter items when filter object is null', async () => {
    const items = [TasksFakeBuilder.aTasks().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });
});
