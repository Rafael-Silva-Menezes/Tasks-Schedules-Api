import { Uuid } from "@core/shared/domain/value-objects/uuid-value-object";
import { ScheduleCreateCommand } from "../interfaces/schedule.types";
import { Schedule } from "./schedule.entity";


describe("Schedule unit tests", () => {
  let validateSpy: any;
  beforeEach(() => {
    Schedule.prototype.validate = jest
      .fn()
      .mockImplementation(Schedule.prototype.validate);
  });

  describe("create command", () => {
    test("should create a schedule with only the required values.", () => {
     const accountId = new Uuid();
   
     const schedule = Schedule.create({
      accountId: accountId,
     });
 
     expect(schedule.getAccountId()).toBe(accountId);
     expect(schedule.getScheduleId()).toBeTruthy();
     expect(schedule.getAgentId()).toBeNull();
     expect(schedule.getStartTime()).toBeNull();
     expect(schedule.getEndTime()).toBeNull();
     expect(schedule.getCreatedAt()).toBeInstanceOf(Date);
     expect(Schedule.prototype.validate).toHaveBeenCalledTimes(1);
    })
 
    test("should create a schedule with all values.", () => {
     const accountId = new Uuid();
     const agentId =  new Uuid();
     const startTime = new Date();
     const endTime = new Date()
     const scheduleId = new Uuid();
 
     const scheduleProps: ScheduleCreateCommand = {
      scheduleId: scheduleId,
       accountId: accountId,
       agentId:agentId,
       startTime:startTime,
       endTime: endTime,
     }
 
     const schedule = Schedule.create(scheduleProps);
 
     expect(schedule.getScheduleId()).toBe(scheduleId);
     expect(schedule.getAccountId()).toBe(accountId);
     expect(schedule.getAgentId()).toBe(agentId);
     expect(schedule.getStartTime()).toBe(startTime);
     expect(schedule.getEndTime()).toBe(endTime);
     expect(schedule.getCreatedAt()).toBeInstanceOf(Date);
     expect(Schedule.prototype.validate).toHaveBeenCalledTimes(1);
    })
 })

 describe("scheduleId field", () => {
  const arrange = [
    {scheduleId: null},
    {scheduleId: undefined},
    {scheduleId: new Uuid()}
  ];

  test.each(arrange)("id = %j", ({scheduleId}) => {
    const schedule = Schedule.create({
      scheduleId: scheduleId,
      accountId: new Uuid(),
    })

    expect(schedule.getScheduleId()).toBeInstanceOf(Uuid);

    if(scheduleId instanceof Uuid) {
      expect(schedule.getScheduleId()).toBe(scheduleId);
    }
  })
 });
 
 describe('setResponsibleAgent method', () => {
  test('should update the agentId', () => {
    const schedule = Schedule.create({
      accountId: new Uuid(),
      startTime: new Date(),
      endTime: new Date(),
    });
    const newAgentId = new Uuid();

    schedule.setResponsibleAgent(newAgentId);
    expect(schedule.getAgentId()).toBe(newAgentId);
  });
});

describe('setStartTime method', () => {
  test('should update the startTime', () => {
    const schedule = Schedule.create({
      accountId: new Uuid(),
      agentId: new Uuid(),
      endTime: new Date(),
    });
    
    const newStartTime = new Date();

    schedule.setStartTime(newStartTime);
    expect(schedule.getStartTime()).toBe(newStartTime);
  });
});

describe('setEndTime method', () => {
  test('should update the endTime', () => {
    const startTime = new Date();
    const schedule = Schedule.create({
      accountId: new Uuid(),
      agentId: new Uuid(),
      startTime: startTime,
    });
    
    const twoHoursLater = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // Adiciona 2 horas em milissegundos
  
    schedule.setEndTime(twoHoursLater);
    expect(schedule.getEndTime()).toEqual(twoHoursLater);
  });
  

  test('should throw an error if startTime is not defined', () => {
    const schedule = Schedule.create({
      accountId: new Uuid(),
      agentId: new Uuid(),
    });
    schedule.setEndTime(new Date())

    expect(schedule.notification.hasErrors()).toBe(true);
    expect(schedule.notification).notificationContainsErrorMessages(
      [{endTime:["startTime must be defined before endTime"]}]
  );
  });

  test('should throw an error if endTime is before startTime', () => {
    const schedule = Schedule.create({
      accountId: new Uuid(),
      agentId: new Uuid(),
      startTime: new Date(),
    });
    
    const endTimeBeforeStartTime = new Date(schedule.getStartTime());
    const startTimeCast = schedule.getStartTime();
    endTimeBeforeStartTime.setHours( startTimeCast.getHours() - 1);
    schedule.setEndTime(endTimeBeforeStartTime)

    expect(schedule.notification.hasErrors()).toBe(true);
    expect(schedule.notification).notificationContainsErrorMessages(
      [{
        endTime: ["endTime must be equal or greater than startTime"],
      }],
    );
  });
});
});