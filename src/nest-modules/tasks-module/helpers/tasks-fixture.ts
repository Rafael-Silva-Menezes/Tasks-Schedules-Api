import { Tasks } from '@core/tasks/domain/entities/tasks.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
const _keysInResponse = [
  'id',
  'accountId',
  'scheduleId',
  'type',
  'startTime',
  'duration',
  'createdAt',
];

export class GetTasksFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateTasksFixture {
  static accountId = new Uuid();
  static scheduleId = new Uuid();
  static startTime = new Date('2024-05-10T08:00:00Z');
  static duration = 1000;
  static type = TasksType.WORK;

  static keysInResponse = _keysInResponse;

  static arrangeForCreate(scheduleId?: Uuid) {
    const faker = Tasks.fake()
      .aTasks()
      .withAccountId(this.accountId)
      .withScheduleId(scheduleId ?? this.scheduleId)
      .withStartTime(this.startTime)
      .withDuration(this.duration)
      .withType(this.type)
      .build();

    return [
      {
        send_data: {
          accountId: faker.getAccountId().id,
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
          startTime: faker.getStartTime(),
          duration: faker.getDuration(),
        },
        title: 'all fields',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
        },
        title: 'only required fields',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
          startTime: faker.getStartTime(),
        },

        title: 'accoutnId, scheduleId, type and startTime',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
          duration: faker.getDuration(),
        },
        title: 'accoutnId, scheduleId, type, and duration',
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a UUID',
            'scheduleId should not be empty',
            'scheduleId must be a UUID',
            'type should not be empty',
            'type must be one of the following values: break, work',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_UNDEFINED: {
        send_data: {
          accountId: undefined,
          scheduleId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_NULL: {
        send_data: {
          accountId: null,
          scheduleId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_EMPTY: {
        send_data: {
          accountId: '',
          scheduleId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_NOT_UUID: {
        send_data: {
          accountId: 5,
          scheduleId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: ['accountId must be a UUID'],
          ...defaultExpected,
        },
      },

      SCHEDULE_ID_UNDEFINED: {
        send_data: {
          scheduleId: undefined,
          accountId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      SCHEDULE_ID_NULL: {
        send_data: {
          scheduleId: null,
          accountId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'scheduleId should not be empty',
            'scheduleId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      SCHEDULE_ID_EMPTY: {
        send_data: {
          scheduleId: '',
          accountId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: [
            'scheduleId should not be empty',
            'scheduleId must be a UUID',
          ],
          ...defaultExpected,
        },
      },
      SCHEDULE_ID_NOT_UUID: {
        send_data: {
          scheduleId: 5,
          accountId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: ['scheduleId must be a UUID'],
          ...defaultExpected,
        },
      },

      START_TIME_NOT_A_DATE: {
        send_data: {
          startTime: 'a',
          scheduleId: new Uuid().id,
          accountId: new Uuid().id,
          type: TasksType.WORK,
        },
        expected: {
          message: ['startTime must be a Date instance'],
          ...defaultExpected,
        },
      },

      DURATION_NOT_A_INTEGER: {
        send_data: {
          startTime: new Date(),
          scheduleId: new Uuid().id,
          accountId: new Uuid().id,
          type: TasksType.WORK,
          duration: '',
        },
        expected: {
          message: [
            'duration must be a number conforming to the specified constraints',
          ],
          ...defaultExpected,
        },
      },

      TYPE_EMPTY: {
        send_data: {
          scheduleId: new Uuid().id,
          accountId: new Uuid().id,
          type: '',
        },
        expected: {
          message: ['type should not be empty'],
          ...defaultExpected,
        },
      },

      TYPE_NULL: {
        send_data: {
          scheduleId: new Uuid().id,
          accountId: new Uuid().id,
          type: null,
        },
        expected: {
          message: ['type should not be empty'],
          ...defaultExpected,
        },
      },

      TYPE_NOT_A_VALID: {
        send_data: {
          scheduleId: new Uuid().id,
          accountId: new Uuid().id,
          type: 'invalid',
        },
        expected: {
          message: ['type must be one of the following values: break, work'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Tasks.fake()
      .aTasks()
      .withAccountId(this.accountId)
      .withScheduleId(this.scheduleId)
      .build();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_INVALID: {
        send_data: {
          scheduleId: faker.getScheduleId().id,
          accountId: faker.getAccountId().id,
          type: 'invalid' as TasksType,
        },
        expected: {
          message: ['type must be one of the following values: break, work'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateTasksFixture {
  static accountId = new Uuid();
  static scheduleId = new Uuid();
  static startTime = new Date('2024-05-10T08:00:00Z');
  static duration = 1000;
  static type = TasksType.WORK;

  static keysInResponse = _keysInResponse;

  static arrangeForUpdate(scheduleId?: Uuid) {
    const faker = Tasks.fake()
      .aTasks()
      .withAccountId(this.accountId)
      .withScheduleId(scheduleId ?? this.scheduleId)
      .withStartTime(this.startTime)
      .withDuration(this.duration)
      .withType(this.type)
      .build();

    return [
      {
        send_data: {
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
          startTime: faker.getStartTime(),
          duration: faker.getDuration(),
        },
      },
      {
        send_data: {
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
        },
      },
      {
        send_data: {
          scheduleId: faker.getScheduleId().id,
          type: faker.getType(),
          startTime: faker.getStartTime(),
        },
      },
      {
        send_data: {
          type: faker.getType(),
          startTime: faker.getStartTime(),
          duration: faker.getDuration(),
        },
      },
    ];
  }

  static arrangeInvalidRequest() {
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      SCHEDULE_ID_EMPTY: {
        send_data: {
          scheduleId: '',
        },
        expected: {
          message: ['scheduleId must be a UUID'],
          ...defaultExpected,
        },
      },
      SCHEDULE_ID_NOT_UUID: {
        send_data: {
          scheduleId: 5,
        },
        expected: {
          message: ['scheduleId must be a UUID'],
          ...defaultExpected,
        },
      },

      START_TIME_NOT_A_DATE: {
        send_data: {
          startTime: 'a',
        },
        expected: {
          message: ['startTime must be a Date instance'],
          ...defaultExpected,
        },
      },

      DURATION_NOT_A_INTEGER: {
        send_data: {
          duration: '',
        },
        expected: {
          message: [
            'duration must be a number conforming to the specified constraints',
          ],
          ...defaultExpected,
        },
      },

      TYPE_EMPTY: {
        send_data: {
          type: '',
        },
        expected: {
          message: ['type must be one of the following values: break, work'],
          ...defaultExpected,
        },
      },

      TYPE_NOT_A_VALID: {
        send_data: {
          type: 'invalid',
        },
        expected: {
          message: ['type must be one of the following values: break, work'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Tasks.fake()
      .aTasks()
      .withAccountId(this.accountId)
      .withScheduleId(this.scheduleId)
      .build();

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      TYPE_INVALID: {
        send_data: {
          scheduleId: faker.getScheduleId().id,
          accountId: faker.getAccountId().id,
          type: 'invalid' as TasksType,
        },
        expected: {
          message: ['type must be defined VALID'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListTasksFixture {
  static arrangeIncrementedWithCreatedAt(scheduleId?: Uuid) {
    const _entities = Tasks.fake()
      .theTasks(4)
      .withAccountId(new Uuid())
      .withScheduleId(scheduleId ?? new Uuid())
      .withType(TasksType.WORK)
      .withStartTime((i) => new Date(new Date().getTime() + i * 4000))
      .withDuration((i) => i * 5000)
      .withCreatedAt((i) => new Date(new Date().getTime() + i * 2000))
      .build();

    const entitiesMap = {
      first: _entities[0],
      second: _entities[1],
      third: _entities[2],
      fourth: _entities[3],
    };

    const arrange = [
      {
        send_data: {},
        expected: {
          entities: [
            entitiesMap.fourth,
            entitiesMap.third,
            entitiesMap.second,
            entitiesMap.first,
          ],
          meta: {
            current_page: 1,
            last_page: 1,
            per_page: 5,
            total: 4,
          },
        },

        title: 'empyt send_data',
      },
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.fourth, entitiesMap.third],
          meta: {
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },

        title: 'page 1, per page 2',
      },
      {
        send_data: {
          page: 2,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.second, entitiesMap.first],
          meta: {
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },

        title: 'page 2, per page 2',
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Tasks.fake().aTasks();

    const entitiesMap = {
      first: faker.withAccountId(new Uuid()).withScheduleId(new Uuid()).build(),
      second: faker
        .withAccountId(new Uuid())
        .withScheduleId(new Uuid())
        .build(),
      third: faker.withAccountId(new Uuid()).withScheduleId(new Uuid()).build(),
      four: faker.withAccountId(new Uuid()).withScheduleId(new Uuid()).build(),
      five: faker.withAccountId(new Uuid()).withScheduleId(new Uuid()).build(),
      six: faker.withAccountId(new Uuid()).withScheduleId(new Uuid()).build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap.first, entitiesMap.second],
          meta: {
            total: 6,
            current_page: 1,
            last_page: 3,
            per_page: 2,
          },
        },
      },
    ];

    return { arrange, entitiesMap };
  }
}
