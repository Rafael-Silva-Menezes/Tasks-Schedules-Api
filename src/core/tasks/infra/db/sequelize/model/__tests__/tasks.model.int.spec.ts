import { setupSequelize } from '@core/shared/infra/helpers/helpers';
import { TasksModel } from '../tasks.model';
import { DataType } from 'sequelize-typescript';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

describe('TasksModel Integration Tests', () => {
  setupSequelize({ models: [TasksModel] });

  test('mapping props', () => {
    const attributesMap = TasksModel.getAttributes();
    const attributes = Object.keys(TasksModel.getAttributes());

    expect(attributes).toStrictEqual([
      'tasksId',
      'scheduleId',
      'accountId',
      'duration',
      'startTime',
      'type',
      'createdAt',
    ]);

    const tasksIdAttr = attributesMap.tasksId;
    expect(tasksIdAttr).toMatchObject({
      field: 'tasks_id',
      fieldName: 'tasksId',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const scheduleIdAttr = attributesMap.scheduleId;
    expect(scheduleIdAttr).toMatchObject({
      field: 'schedule_id',
      fieldName: 'scheduleId',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const accountIdAttr = attributesMap.accountId;
    expect(accountIdAttr).toMatchObject({
      field: 'account_id',
      fieldName: 'accountId',
      type: DataType.UUID(),
    });

    const durationAttr = attributesMap.duration;
    expect(durationAttr).toMatchObject({
      field: 'duration',
      fieldName: 'duration',
      allowNull: true,
      type: DataType.INTEGER(),
    });

    const typeAttr = attributesMap.type;
    expect(typeAttr).toMatchObject({
      field: 'type',
      fieldName: 'type',
      type: DataType.ENUM(...Object.values(TasksType)),
    });

    const startTimeAttr = attributesMap.startTime;
    expect(startTimeAttr).toMatchObject({
      field: 'start_time',
      fieldName: 'startTime',
      allowNull: true,
      type: DataType.DATE(3),
    });

    const createdAtAttr = attributesMap.createdAt;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'createdAt',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test('should create a tasks', async () => {
    const arrange = {
      accountId: new Uuid().id,
      scheduleId: new Uuid().id,
      type: TasksType.BREAK,
      tasksId: new Uuid().id,
      startTime: new Date(),
      duration: 100,
      createdAt: new Date(),
    };

    const tasks = await TasksModel.create(arrange);

    expect(tasks.toJSON()).toStrictEqual(arrange);
  });
});
