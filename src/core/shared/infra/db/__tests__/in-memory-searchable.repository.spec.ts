import { Entity } from '@core/shared/domain/entities/entity';
import { SearchParams } from '@core/shared/domain/repository/search/search-params';
import { SearchResult } from '@core/shared/domain/repository/search/search-result';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { InMemorySearchableRepository } from '../in-memory-searchable.repository';

type StubEntityConstructorProps = {
  entityId?: Uuid;
  name: string;
  value: number;
};

class StubEntity extends Entity {
  entityId: Uuid;
  name: string;
  value: number;
  constructor(props: StubEntityConstructorProps) {
    super();
    this.entityId = props.entityId ?? new Uuid();
    this.name = props.name;
    this.value = +props.value;
  }

  toJson(): { id: string } & StubEntityConstructorProps {
    return {
      id: this.entityId.id,
      name: this.name,
      value: this.value,
    };
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  Uuid
> {
  sortableFields: string[] = ['name'];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.value.toString() === filter
      );
    });
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let repository: StubInMemorySearchableRepository;

  beforeEach(() => (repository = new StubInMemorySearchableRepository()));

  describe('applyFilter method', () => {
    it('should no filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', value: 5 })];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      const itemsFiltered = await repository['applyFilter'](items, null);
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'test', value: 5 }),
        new StubEntity({ name: 'TEST', value: 5 }),
        new StubEntity({ name: 'fake', value: 0 }),
      ];

      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      let itemsFiltered = await repository['applyFilter'](items, 'TEST');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repository['applyFilter'](items, '5');
      expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repository['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toHaveLength(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    });
  });

  describe('applySort method', () => {
    it('should no sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', value: 5 }),
        new StubEntity({ name: 'a', value: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repository['applySort'](items, 'value', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    });

    it('should sort items', async () => {
      const items = [
        new StubEntity({ name: 'b', value: 5 }),
        new StubEntity({ name: 'a', value: 5 }),
        new StubEntity({ name: 'c', value: 5 }),
      ];

      let itemsSorted = await repository['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);

      itemsSorted = await repository['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);
    });
  });

  describe('applyPaginate method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'a', value: 5 }),
        new StubEntity({ name: 'b', value: 5 }),
        new StubEntity({ name: 'c', value: 5 }),
        new StubEntity({ name: 'd', value: 5 }),
        new StubEntity({ name: 'e', value: 5 }),
      ];

      let itemsPaginated = await repository['applyPaginate'](items, 1, 2);
      expect(itemsPaginated).toStrictEqual([items[0], items[1]]);

      itemsPaginated = await repository['applyPaginate'](items, 2, 2);
      expect(itemsPaginated).toStrictEqual([items[2], items[3]]);

      itemsPaginated = await repository['applyPaginate'](items, 3, 2);
      expect(itemsPaginated).toStrictEqual([items[4]]);

      itemsPaginated = await repository['applyPaginate'](items, 4, 2);
      expect(itemsPaginated).toStrictEqual([]);
    });
  });

  describe('search method', () => {
    it('should apply only paginate when other params are null', async () => {
      const entity = new StubEntity({ name: 'a', value: 5 });
      const items = Array(16).fill(entity);
      repository.items = items;

      const result = await repository.search(new SearchParams());
      expect(result).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
        }),
      );
    });

    it('should apply paginate and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', value: 5 }),
        new StubEntity({ name: 'a', value: 5 }),
        new StubEntity({ name: 'TEST', value: 5 }),
        new StubEntity({ name: 'TeSt', value: 5 }),
      ];
      repository.items = items;

      let result = await repository.search(
        new SearchParams({ page: 1, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }),
      );

      result = await repository.search(
        new SearchParams({ page: 2, per_page: 2, filter: 'TEST' }),
      );
      expect(result).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }),
      );
    });

    describe('should apply paginate and sort', () => {
      const items = [
        new StubEntity({ name: 'b', value: 5 }),
        new StubEntity({ name: 'a', value: 5 }),
        new StubEntity({ name: 'd', value: 5 }),
        new StubEntity({ name: 'e', value: 5 }),
        new StubEntity({ name: 'c', value: 5 }),
      ];
      const arrange = [
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[1], items[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          search_result: new SearchResult({
            items: [items[4], items[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[3], items[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          search_result: new SearchResult({
            items: [items[4], items[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(() => {
        repository.items = items;
      });

      test.each(arrange)(
        'when value is %j',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result).toStrictEqual(search_result);
        },
      );
    });

    it('should search using filter, sort and paginate', async () => {
      const items = [
        new StubEntity({ name: 'test', value: 5 }),
        new StubEntity({ name: 'a', value: 5 }),
        new StubEntity({ name: 'TEST', value: 5 }),
        new StubEntity({ name: 'e', value: 5 }),
        new StubEntity({ name: 'TeSt', value: 5 }),
      ];
      repository.items = items;

      const arrange = [
        {
          params: new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[2], items[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new SearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          result: new SearchResult({
            items: [items[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result).toStrictEqual(i.result);
      }
    });
  });
});
