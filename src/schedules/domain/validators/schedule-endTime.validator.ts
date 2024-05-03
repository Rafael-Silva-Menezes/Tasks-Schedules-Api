import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

interface ScheduleObject {
  startTime?: Date;
}

@ValidatorConstraint({ name: 'isBeforeEndTime', async: false })
export class IsValidEndTimeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const scheduleObject = args.object as ScheduleObject;
    const startTime = scheduleObject.startTime;


    if (!startTime) {
      return false; 
    }

    if (!(value instanceof Date) || !(startTime instanceof Date)) {
      return false;
    }

    if (value.getTime() >= startTime.getTime()) {
      return true; 
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    const scheduleObject = args.object as ScheduleObject;
    const startTime = scheduleObject.startTime;

    if (!startTime) {
      return 'startTime must be defined before endTime';
    }

    return 'endTime must be before startTime';
  }
}
