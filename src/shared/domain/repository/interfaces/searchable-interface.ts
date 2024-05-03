import { Entity } from "../../entities/entity";
import { ValueObject } from "../../entities/value-object";
import { SearchParams } from "../search/search-params";
import { SearchResult } from "../search/search-result";
import { IRepository } from "./repository-interface";


export interface ISearchableRepository<
  E extends Entity,
  EntityId extends ValueObject,
  Filter = string,
  SearchInput = SearchParams<Filter>,
  SearchOutput = SearchResult
> extends IRepository<E, EntityId> {
  sortableFields: string[];
  search(props: SearchInput): Promise<SearchOutput>;
}
