import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";

export type ScheduleConstructorProps = {
 scheduleId?: Uuid;
 accountId: Uuid;
 agentId?: Uuid;
 startTime?: Date;
 endTime?: Date;
 createdAt?: Date;
};


export type ScheduleCreateCommand = ScheduleConstructorProps;