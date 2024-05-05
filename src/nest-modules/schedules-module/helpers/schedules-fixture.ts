import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
const _keysInResponse = [
  'id',
  'accountId',
  'agentId',
  'startTime',
  'endTime',
  'createdAt',
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
      .withEndTime(this.endTime)
      .build();

    return [
      {
        send_data: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime(),
          endTime: faker.getEndTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime().toISOString(),
          endTime: faker.getEndTime().toISOString(),
        },
        title: 'all fields',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
          startTime: null,
          endTime: null,
        },
        title: 'accountId and agentId',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          startTime: faker.getStartTime(),
          endTime: faker.getEndTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: faker.getStartTime().toISOString(),
          endTime: faker.getEndTime().toISOString(),
        },
        title: 'accountId, startTime and endTime',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: faker.getEndTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: faker.getStartTime().toISOString(),
          endTime: null,
        },
        title: 'accountId and startTime',
      },
      {
        send_data: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: null,
          endTime: null,
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: null,
          endTime: null,
        },
        title: 'only required fields',
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
            'accountId must be a UUID',
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
            'accountId must be a UUID',
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
            'accountId must be a UUID',
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
            'accountId must be a UUID',
            'agentId must be a UUID',
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
            'accountId must be a UUID',
            'agentId must be a UUID',
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
            'accountId must be a UUID',
            'startTime must be a Date instance',
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
            'accountId must be a UUID',
            'endTime must be a Date instance',
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
          accountId: faker.accountId.id,
          endTime: faker.withEndTime(new Date()).endTime,
        },
        expected: {
          message: ['startTime must be defined before endTime'],
          ...defaultExpected,
        },
      },

      END_TIME_BEFORE_START_TIME: {
        send_data: {
          accountId: faker.accountId.id,
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
      .withEndTime(this.endTime)
      .build();

    return [
      {
        send_data: {
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime(),
          endTime: faker.getEndTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime().toISOString(),
          endTime: faker.getEndTime().toISOString(),
        },
      },
      {
        send_data: {
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
          startTime: faker.getStartTime().toISOString(),
          endTime: null,
        },
      },
      {
        send_data: {
          startTime: faker.getStartTime(),
          endTime: faker.getEndTime(),
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: null,
          startTime: faker.getStartTime().toISOString(),
          endTime: faker.getEndTime().toISOString(),
        },
      },
      {
        send_data: {
          agentId: faker.getAgentId().id,
        },
        expected: {
          accountId: faker.getAccountId().id,
          agentId: faker.getAgentId().id,
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
          message: ['agentId must be a UUID'],
          ...defaultExpected,
        },
      },
      AGENT_ID_NOT_UUID: {
        send_data: {
          agentId: 5,
        },
        expected: {
          message: ['agentId must be a UUID'],
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

      END_TIME_NOT_A_DATE: {
        send_data: {
          endTime: 'a',
        },
        expected: {
          message: ['endTime must be a Date instance'],
          ...defaultExpected,
        },
      },
    };
  }

  static arrangeForEntityValidationError() {
    const faker = Schedule.fake().aSchedule().withEndTime(new Date()).build();
    const defaultExpected = {
      statusCode: 422,
      error: 'Unprocessable Entity',
    };

    return {
      END_TIME_WITHOUT_START_TIME: {
        send_data: {
          endTime: faker.getEndTime(),
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
      .withAgentId(() => new Uuid())
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
    const faker = Schedule.fake().aSchedule();

    const entitiesMap = {
      first: faker.withAccountId(new Uuid()).build(),
      second: faker.withAccountId(new Uuid()).build(),
      third: faker.withAccountId(new Uuid()).build(),
      four: faker.withAccountId(new Uuid()).build(),
      five: faker.withAccountId(new Uuid()).build(),
      six: faker.withAccountId(new Uuid()).build(),
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
