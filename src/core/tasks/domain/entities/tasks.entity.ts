import { Entity } from '@core/shared/domain/entities/entity';
import { ValueObject } from '@core/shared/domain/entities/value-object';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';

import {
  TasksConstructorProps,
  TasksCreateCommand,
  TasksType,
} from '../interfaces/tasks.types';
import { TasksValidatorFactory } from '../validators/tasks.validator';
import { TasksFakeBuilder } from './tasks-faker.builder';

export class Tasks extends Entity {
  private tasksId: Uuid;
  private scheduleId: Uuid;
  private accountId: Uuid;
  private startTime: Date;
  private duration: number;
  private type: TasksType;
  private createdAt: Date;

  constructor(props: TasksConstructorProps) {
    super();
    this.tasksId = props.tasksId || new Uuid();
    this.scheduleId = props.scheduleId;
    this.accountId = props.accountId;
    this.startTime = props.startTime ?? null;
    this.duration = props.duration ?? null;
    this.type = props.type;
    this.createdAt = props.createdAt ?? new Date();
  }

  get entityId(): ValueObject {
    return this.tasksId;
  }

  static create(props: TasksCreateCommand): Tasks {
    const tasks = new Tasks(props);
    tasks.validate(['type']);
    return tasks;
  }

  validate(fields?: string[]) {
    const validator = TasksValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  setDuration(duration: number): void {
    this.duration = duration;
  }

  setType(type: TasksType): void {
    this.type = type;
    this.validate(['type']);
  }

  setStartTime(startTime: Date): void {
    this.startTime = startTime;
  }

  setScheduleId(scheduleId: Uuid): void {
    this.scheduleId = scheduleId;
  }

  getTasksId(): Uuid {
    return this.tasksId;
  }

  getScheduleId(): Uuid {
    return this.scheduleId;
  }

  getAccountId(): Uuid {
    return this.accountId;
  }

  getStartTime(): Date | null {
    return this.startTime || null;
  }

  getDuration(): number | null {
    return this.duration || null;
  }

  getType(): TasksType {
    return this.type;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  static fake() {
    return TasksFakeBuilder;
  }

  toJson() {
    return {
      tasksId: this.getTasksId().id,
      scheduleId: this.getScheduleId().id,
      accountId: this.getAccountId().id,
      startTime: this.getStartTime(),
      duration: this.getDuration(),
      type: this.getType(),
      createdAt: this.getCreatedAt(),
    };
  }
}
