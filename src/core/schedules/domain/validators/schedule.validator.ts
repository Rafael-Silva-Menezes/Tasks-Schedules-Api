import { ClassValidatorFields } from "@core/shared/domain/validators/class-fields.validator";
import { ScheduleRules } from "./schedule-rules.validator";
import { Notification } from "@core/shared/domain/validators/notification";

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

