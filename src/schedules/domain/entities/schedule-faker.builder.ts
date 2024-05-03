import { Chance } from "chance";
import { Uuid } from "../../../shared/domain/value-objects/uuid-value-object";
import { Schedule } from "../../domain/entities/schedule.entity";

type PropOrFactory<T> = T | ((index: number) => T);

export class ScheduleFakeBuilder<TBuild = any> {
  private _scheduleId: PropOrFactory<Uuid> | undefined = undefined;
  private _accountId: PropOrFactory<Uuid> = new Uuid() || undefined;
  private _agentId: PropOrFactory<Uuid> | undefined = new Uuid() || null;
  private _startTime: PropOrFactory<Date> = (_index) => new Date() || null;
  private _endTime: PropOrFactory<Date | null> = (_index) => new Date() || null;
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs;

  static aSchedule() {
    return new ScheduleFakeBuilder<Schedule>();
  }

  static theSchedules(countObjs: number) {
    return new ScheduleFakeBuilder<Schedule[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withScheduleId(valueOrFactory: PropOrFactory<Uuid>) {
    this._scheduleId = valueOrFactory;
    return this;
  }

  withAccountId(valueOrFactory: PropOrFactory<Uuid>) {
    this._accountId = valueOrFactory;
    return this;
  }

  withAgentId(valueOrFactory: PropOrFactory<Uuid>) {
    this._agentId = valueOrFactory;
    return this;
  }

  withStartTime(valueOrFactory: PropOrFactory<Date>) {
    this._startTime = valueOrFactory;
    return this;
  }

  withEndTime(valueOrFactory: PropOrFactory<Date | null>) {
    this._endTime = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  build(): TBuild {

    const schedules = new Array(this.countObjs)
    .fill(undefined)
    .map((_, index) => {
      const schedule = new Schedule({
        scheduleId: this._scheduleId ? this.callFactory(this._scheduleId, index) : undefined,
        accountId: this._accountId ? this.callFactory(this._accountId, index) : undefined,
        agentId: this._agentId ? this.callFactory(this._agentId, index) : undefined,
        startTime: this.callFactory(this._startTime, index),
        endTime: this.callFactory(this._endTime, index),
        createdAt: this._createdAt ? this.callFactory(this._createdAt, index) : undefined,
      });
      return schedule;
    });
    return this.countObjs === 1 ? (schedules[0] as any) : schedules;
  }

  get scheduleId() {
    return this._scheduleId;
  }

  get accountId() {
    return this._accountId;
  }

  get agentId() {
    return this._agentId;
  }

  get startTime() {
    return this._startTime;
  }

  get endTime() {
    return this._endTime;
  }

  get createdAt() {
    return this._createdAt;
  }

  private getValue(prop: any) {
    const optional = ["scheduleId", "createdAt"];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === "function"
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
