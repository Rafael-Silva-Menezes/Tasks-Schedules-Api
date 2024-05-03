import { ClassValidatorFields } from "../../../shared/domain/validators/class-fields.validator";
import { Notification } from "../../../shared/domain/validators/notification";
import { ScheduleRules } from "./schedule-rules.validator";

export class ScheduleValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['endTime'];
    return super.validate(notification, new ScheduleRules(data), newFields);
  }
}

export class ScheduleValidatorFactory {
 static create() {
   return new ScheduleValidator();
 }
}

