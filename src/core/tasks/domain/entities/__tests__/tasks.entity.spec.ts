import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '../tasks.entity';
import { TasksCreateCommand, TasksType } from '../../interfaces/tasks.types';

describe('Tasks unit tests', () => {
  let validateSpy: any;
  beforeEach(() => {
    Tasks.prototype.validate = jest
      .fn()
      .mockImplementation(Tasks.prototype.validate);
  });

  describe('create command', () => {
    test('should create a tasks with only the required values.', () => {
      const accountId = new Uuid();
      const scheduleId = new Uuid();
      const type: TasksType = TasksType.BREAK;

      const tasks = Tasks.create({
        accountId: accountId,
        scheduleId: scheduleId,
        type: type,
      });

      expect(tasks.getTasksId()).toBeTruthy();
      expect(tasks.getAccountId()).toBe(accountId);
      expect(tasks.getScheduleId()).toBe(scheduleId);
      expect(tasks.getType()).toBe(type);
      expect(tasks.getStartTime()).toBeNull();
      expect(tasks.getDuration()).toBeNull();
      expect(tasks.getCreatedAt()).toBeInstanceOf(Date);
      expect(Tasks.prototype.validate).toHaveBeenCalledTimes(1);
    });

    test('should create a schedule with all values.', () => {
      const tasksProps: TasksCreateCommand = {
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.BREAK,
        tasksId: new Uuid(),
        startTime: new Date(),
        duration: 100,
        createdAt: new Date(),
      };

      const tasks = Tasks.create(tasksProps);

      expect(tasks.getTasksId()).toBe(tasksProps.tasksId);
      expect(tasks.getScheduleId()).toBe(tasksProps.scheduleId);
      expect(tasks.getAccountId()).toBe(tasksProps.accountId);
      expect(tasks.getStartTime()).toBe(tasksProps.startTime);
      expect(tasks.getDuration()).toBe(tasksProps.duration);
      expect(tasks.getType()).toBe(tasksProps.type);
      expect(tasks.getCreatedAt()).toBe(tasksProps.createdAt);
      expect(Tasks.prototype.validate).toHaveBeenCalledTimes(1);
    });
  });

  describe('tasksId field', () => {
    const arrange = [
      { tasksId: null },
      { tasksId: undefined },
      { tasksId: new Uuid() },
    ];

    test.each(arrange)('id = %j', ({ tasksId }) => {
      const schedule = Tasks.create({
        tasksId: tasksId,
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      });

      expect(schedule.getTasksId()).toBeInstanceOf(Uuid);

      if (tasksId instanceof Uuid) {
        expect(schedule.getTasksId()).toBe(tasksId);
      }
    });
  });

  describe('setDuration method', () => {
    test('should update the duration', () => {
      const schedule = Tasks.create({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      });

      const duration = 1000;

      schedule.setDuration(duration);
      expect(schedule.getDuration()).toBe(duration);
    });
  });

  describe('setType method', () => {
    test('should update the type', () => {
      const tasks = Tasks.create({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      });

      const typeTasks = TasksType.BREAK;

      tasks.setType(typeTasks);
      expect(tasks.getType()).toBe(typeTasks);
    });
  });

  describe('setTime method', () => {
    test('should update the startTime', () => {
      const tasks = Tasks.create({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      });

      const startTime = new Date();

      tasks.setStartTime(startTime);
      expect(tasks.getStartTime()).toBe(startTime);
    });
  });

  describe('setScheduleId method', () => {
    test('should update the time', () => {
      const schedule = Tasks.create({
        accountId: new Uuid(),
        scheduleId: new Uuid(),
        type: TasksType.WORK,
      });

      const scheduleId = new Uuid();

      schedule.setScheduleId(scheduleId);
      expect(schedule.getScheduleId()).toBe(scheduleId);
    });
  });
});
