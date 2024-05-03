import { ISearchableRepository } from "@core/shared/domain/repository/interfaces/searchable-interface";
import { SearchParams } from "@core/shared/domain/repository/search/search-params";
import { SearchResult } from "@core/shared/domain/repository/search/search-result";
import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../entities/schedule.entity";

export type ScheduleFilter = string;

export class ScheduleSearchParams extends SearchParams<ScheduleFilter>{}

export class ScheduleSearchResult extends SearchResult<Schedule>{}

export interface IScheduleRepository 
extends ISearchableRepository<
Schedule, 
Uuid, 
ScheduleFilter, 
ScheduleSearchParams, 
ScheduleSearchResult
>{}