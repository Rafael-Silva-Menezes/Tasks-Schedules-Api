import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

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
      return true;
    }

    if (!startTime) {
      return false;
    }

    return new Date(value).getTime() >= new Date(startTime).getTime();
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
