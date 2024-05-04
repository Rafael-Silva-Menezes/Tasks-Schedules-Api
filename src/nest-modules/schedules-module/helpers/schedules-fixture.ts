import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
const _keysInResponse = [
  'id',
  'name',
  'description',
  'is_active',
  'created_at',
];

export class GetScheduleFixture {
  static keysInResponse = _keysInResponse;
}

export class CreateScheduleFixture {
  static accountId = new Uuid();
  static agentId = new Uuid();

  static startTime = new Date('2024-05-10T08:00:00Z');
  static endTime = new Date('2024-06-10T09:00:00Z');

  static keysInResponse = _keysInResponse;

  static arrangeForCreate() {
    const faker = Schedule.fake()
      .aSchedule()
      .withAccountId(this.accountId)
      .withAgentId(this.agentId)
      .withStartTime(this.startTime)
      .withEndTime(this.endTime);

    return [
      {
        send_data: {
          accountId: faker.accountId.id,
          agentId: faker.agentId.id,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
        expected: {
          accountId: faker.accountId.id,
          agentId: faker.agentId.id,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
      },
      {
        send_data: {
          accountId: faker.accountId.id,
          agentId: faker.agentId.id,
        },
        expected: {
          accountId: faker.accountId.id,
          agentId: faker.agentId.id,
          startTime: null,
          endTime: null,
        },
      },
      {
        send_data: {
          accountId: faker.accountId,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
      },
      {
        send_data: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
          endTime: null,
        },
      },
      {
        send_data: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
      },
      {
        send_data: {
          accountId: faker.accountId,
          agentId: null,
          startTime: null,
          endTime: null,
        },
        expected: {
          accountId: faker.accountId,
          agentId: null,
          startTime: null,
          endTime: null,
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
      EMPTY: {
        send_data: {},
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_UNDEFINED: {
        send_data: {
          accountId: undefined,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_NULL: {
        send_data: {
          accountId: null,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
          ],
          ...defaultExpected,
        },
      },
      ACCOUNT_ID_EMPTY: {
        send_data: {
          accountId: '',
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
          ],
          ...defaultExpected,
        },
      },
      AGENT_ID_EMPTY: {
        send_data: {
          agentId: '',
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
            'agentId must be a uuid',
          ],
          ...defaultExpected,
        },
      },

      AGENT_ID_NOT_UUID: {
        send_data: {
          agentId: 5,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
            'agentId must be a uuid',
          ],
          ...defaultExpected,
        },
      },

      START_TIME_NOT_A_DATE: {
        send_data: {
          startTime: 'a',
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
            'startTime must be a Date value',
          ],
          ...defaultExpected,
        },
      },

      END_TIME_NOT_A_DATE: {
        send_data: {
          endTime: 'a',
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
            'endTime must be a Date value',
          ],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Schedule.fake().aSchedule().withAccountId(this.accountId);

    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      END_TIME_WITHOUT_START_TIME: {
        send_data: {
          endTime: faker.withEndTime(new Date()).endTime,
        },
        expected: {
          message: ['startTime must be defined before endTime'],
          ...defaultExpected,
        },
      },

      END_TIME_BEFORE_START_TIME: {
        send_data: {
          startTime: new Date('2024-06-10T09:00:00Z'),
          endTime: new Date('2024-05-10T08:00:00Z'),
        },
        expected: {
          message: ['endTime must be equal or greater than startTime'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class UpdateScheduleFixture {
  static keysInResponse = _keysInResponse;
  static accountId = new Uuid();
  static agentId = new Uuid();

  static startTime = new Date('2024-05-10T08:00:00Z');
  static endTime = new Date('2024-06-10T09:00:00Z');

  static arrangeForUpdate() {
    const faker = Schedule.fake()
      .aSchedule()
      .withAccountId(this.accountId)
      .withAgentId(this.agentId)
      .withStartTime(this.startTime)
      .withEndTime(this.endTime);

    return [
      {
        send_data: {
          agentId: faker.agentId,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: faker.agentId,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
      },
      {
        send_data: {
          agentId: faker.agentId,
          startTime: faker.startTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: faker.agentId,
          startTime: faker.startTime,
          endTime: null,
        },
      },
      {
        send_data: {
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
        expected: {
          accountId: faker.accountId,
          agentId: null,
          startTime: faker.startTime,
          endTime: faker.endTime,
        },
      },
      {
        send_data: {
          agentId: faker.agentId,
        },
        expected: {
          accountId: faker.accountId,
          agentId: faker.agentId,
          startTime: null,
          endTime: null,
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
      AGENT_ID_EMPTY: {
        send_data: {
          agentId: '',
        },
        expected: {
          message: ['agentId must be a uuid'],
          ...defaultExpected,
        },
      },
      AGENT_ID_NOT_UUID: {
        send_data: {
          agentId: 5,
        },
        expected: {
          message: [
            'accountId should not be empty',
            'accountId must be a uuid',
            'agentId must be a uuid',
          ],
          ...defaultExpected,
        },
      },

      START_TIME_NOT_A_DATE: {
        send_data: {
          startTime: 'a',
        },
        expected: {
          message: ['startTime must be a Date value'],
          ...defaultExpected,
        },
      },

      END_TIME_NOT_A_DATE: {
        send_data: {
          endTime: 'a',
        },
        expected: {
          message: ['endTime must be a Date value'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Schedule.fake().aSchedule();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      END_TIME_WITHOUT_START_TIME: {
        send_data: {
          endTime: faker.withEndTime(new Date()).endTime,
        },
        expected: {
          message: ['startTime must be defined before endTime'],
          ...defaultExpected,
        },
      },

      END_TIME_BEFORE_START_TIME: {
        send_data: {
          startTime: new Date('2024-06-10T09:00:00Z'),
          endTime: new Date('2024-05-10T08:00:00Z'),
        },
        expected: {
          message: ['endTime must be equal or greater than startTime'],
          ...defaultExpected,
        },
      },
    };
  }
}

export class ListSchedulesFixture {
  static arrangeIncrementedWithCreatedAt() {
    const _entities = Schedule.fake()
      .theSchedules(4)
      .withAccountId(() => new Uuid())
      .withAgentId((i) => new Uuid())
      .withStartTime((i) => new Date(new Date().getTime() + i * 4000))
      .withEndTime((i) => new Date(new Date().getTime() + i * 5000))
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
            per_page: 15,
            total: 4,
          },
        },
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
      },
    ];

    return { arrange, entitiesMap };
  }

  static arrangeUnsorted() {
    const faker = Schedule.fake().aSchedule();

    const entitiesMap = {
      1: faker.withAccountId(new Uuid()).build(),
      2: faker.withAccountId(new Uuid()).build(),
      3: faker.withAccountId(new Uuid()).build(),
      4: faker.withAccountId(new Uuid()).build(),
      5: faker.withAccountId(new Uuid()).build(),
      6: faker.withAccountId(new Uuid()).build(),
    };

    const arrange = [
      {
        send_data: {
          page: 1,
          per_page: 2,
        },
        expected: {
          entities: [entitiesMap[1], entitiesMap[2]],
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
