import { Schedule } from "@core/schedules/domain/entities/schedule.entity";
import { IScheduleRepository, ScheduleFilter } from "@core/schedules/domain/interfaces/schedule.repository";
import { SortDirection } from "@core/shared/domain/repository/search/search-params";
import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { InMemorySearchableRepository } from "@core/shared/infra/db/in-memory-searchable.repository";

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
