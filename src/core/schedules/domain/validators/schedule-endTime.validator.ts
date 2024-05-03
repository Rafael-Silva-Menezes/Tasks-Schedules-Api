import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

interface ScheduleObject {
  startTime?: Date;
  endTime?: Date;
}

@ValidatorConstraint({ name: 'IsValidEndTimeConstraint', async: false })
export class IsValidEndTimeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const scheduleObject = args.object as ScheduleObject;
    const startTime = scheduleObject.startTime;
    const endTime = scheduleObject.endTime;

    if (!endTime) {
      return true; // endTime is null, no validation needed
    }

    if (!startTime) {
      return false; // startTime is null but endTime is defined, invalid
    }

    if ((value !== null && !(value instanceof Date)) || (startTime !== null && !(startTime instanceof Date))) {
      return false; // Not both values are Dates or null
    }
    

    return value.getTime() >= startTime.getTime(); // endTime must be greater than or equal to startTime
  }

  defaultMessage(args: ValidationArguments) {
    const scheduleObject = args.object as ScheduleObject;
    const startTime = scheduleObject.startTime;

    if (!startTime) {
      return 'startTime must be defined before endTime';
    }

    return 'endTime must be equal or greater than startTime';
  }
}
