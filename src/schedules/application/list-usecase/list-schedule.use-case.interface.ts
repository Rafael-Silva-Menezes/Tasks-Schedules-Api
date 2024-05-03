import { PaginationOutput } from "../../../shared/application/pagination-output";
import { IUseCase } from "../../../shared/application/use-case.interfce";
import { SortDirection } from "../../../shared/domain/repository/search/search-params";
import { ScheduleFilter } from "../../domain/interfaces/schedule.repository";
import { ScheduleOutput } from "../common/schedule.use-case.mapper.types";

export type ListSchedulesInput = {
 page?: number;
 per_page?: number;
 sort?: string | null;
 sort_dir?: SortDirection | null;
 filter?: ScheduleFilter | null;
};

export type ListSchedulesOutput = PaginationOutput<ScheduleOutput>;
export interface IListUseCase extends IUseCase<ListSchedulesInput, ListSchedulesOutput>{}
