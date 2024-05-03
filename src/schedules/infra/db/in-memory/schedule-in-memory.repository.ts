import { SortDirection } from "../../../../shared/domain/repository/search/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid-value-object";
import { InMemorySearchableRepository } from "../../../../shared/infra/db/in-memory-searchable.repository";
import { Schedule } from "../../../domain/entities/schedule.entity";
import { IScheduleRepository, ScheduleFilter } from "../../../domain/interfaces/schedule.repository";

export class ScheduleInMemoryRepository extends InMemorySearchableRepository<Schedule, Uuid> implements IScheduleRepository {
    sortableFields: string[] = ["agentId", "accountId", "createdAt"];

    getEntity(): new (...args: any[]) => Schedule {
        return Schedule;
    }

    protected async applyFilter(items: Schedule[], filter: ScheduleFilter): Promise<Schedule[]> {
        if (!filter) {
            return items;
        }
        
        return items.filter((i) => {
            return (i.getAgentId() && i.getAgentId().id.toLowerCase().includes(filter.toLowerCase())) ||
                (i.getAccountId() && i.getAccountId().id.toLowerCase().includes(filter.toLowerCase()));
        });
    }

    protected applySort(
        items: Schedule[],
        sort: string | null,
        sort_dir: SortDirection | null,
    ): Schedule[] {
        return sort ?
            super.applySort(items, sort, sort_dir) :
            super.applySort(items, "createdAt", "desc");
    }
}
