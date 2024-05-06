import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from './tasks.entity';
import { Chance } from 'chance';
import { TasksType } from '../interfaces/tasks.types';

type PropOrFactory<T> = T | ((index: number) => T);

export class TasksFakeBuilder<TBuild = any> {
  private _tasksId: PropOrFactory<Uuid> | undefined = undefined;
  private _scheduleId: PropOrFactory<Uuid> | undefined =
    new Uuid() || undefined;
  private _accountId: PropOrFactory<Uuid> | undefined = new Uuid() || undefined;
  private _startTime: PropOrFactory<Date | null> = (_index) => null;
  private _duration: PropOrFactory<number | null> = (_index) => null;
  private _type: PropOrFactory<TasksType> | undefined = TasksType.BREAK;
  private _createdAt: PropOrFactory<Date> | undefined = undefined;

  private countObjs = 0;

  static aTasks() {
    return new TasksFakeBuilder<Tasks>();
  }

  static theTasks(countObjs: number) {
    return new TasksFakeBuilder<Tasks[]>(countObjs);
  }

  private chance: Chance.Chance;

  private constructor(countObjs: number = 1) {
    this.countObjs = countObjs;
    this.chance = Chance();
  }

  withTasksId(valueOrFactory: PropOrFactory<Uuid>) {
    this._tasksId = valueOrFactory;
    return this;
  }

  withScheduleId(valueOrFactory: PropOrFactory<Uuid>) {
    this._scheduleId = valueOrFactory;
    return this;
  }

  withAccountId(valueOrFactory: PropOrFactory<Uuid>) {
    this._accountId = valueOrFactory;
    return this;
  }

  withStartTime(valueOrFactory: PropOrFactory<Date | null>) {
    this._startTime = valueOrFactory;
    return this;
  }

  withDuration(valueOrFactory: PropOrFactory<number | null>) {
    this._duration = valueOrFactory;
    return this;
  }

  withType(valueOrFactory: PropOrFactory<TasksType>) {
    this._type = valueOrFactory;
    return this;
  }

  withCreatedAt(valueOrFactory: PropOrFactory<Date>) {
    this._createdAt = valueOrFactory;
    return this;
  }

  build(): TBuild {
    const tasks = new Array(this.countObjs).fill(undefined).map((_, index) => {
      const task = new Tasks({
        tasksId: this._tasksId
          ? this.callFactory(this._tasksId, index)
          : undefined,
        scheduleId: this._scheduleId
          ? this.callFactory(this._scheduleId, index)
          : undefined,
        accountId: this._accountId
          ? this.callFactory(this._accountId, index)
          : undefined,
        startTime: this.callFactory(this._startTime, index),
        duration: this.callFactory(this._duration, index),
        type: this.callFactory(this._type, index),
        createdAt: this._createdAt
          ? this.callFactory(this._createdAt, index)
          : undefined,
      });
      task.validate();
      return task;
    });
    return this.countObjs === 1 ? (tasks[0] as any) : tasks;
  }

  get tasksId() {
    return this.getValue('tasksId');
  }

  get scheduleId() {
    return this.getValue('scheduleId');
  }

  get accountId() {
    return this.getValue('accountId');
  }

  get startTime() {
    return this.getValue('startTime');
  }

  get duration() {
    return this.getValue('duration');
  }

  get type() {
    return this.getValue('type');
  }

  get createdAt() {
    return this.getValue('createdAt');
  }

  private getValue(prop: any) {
    const optional = ['tasksId', 'scheduleId', 'accountId', 'createdAt'];
    const privateProp = `_${prop}` as keyof this;
    if (!this[privateProp] && optional.includes(prop)) {
      throw new Error(
        `Property ${prop} not have a factory, use 'with' methods`,
      );
    }
    return this.callFactory(this[privateProp], 0);
  }

  private callFactory(factoryOrValue: PropOrFactory<any>, index: number) {
    return typeof factoryOrValue === 'function'
      ? factoryOrValue(index)
      : factoryOrValue;
  }
}
