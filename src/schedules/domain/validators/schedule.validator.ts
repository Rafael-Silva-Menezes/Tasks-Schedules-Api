import { Schedule } from "../../../schedules/domain/entities/schedule.entity";
import { ClassValidatorFields } from "../../../shared/domain/validators/class-fields.validator";
import { ScheduleRules } from "./schedule-rules.validator";

export class ScheduleValidator extends ClassValidatorFields<ScheduleRules> {
  validate(entity: Schedule) {
    return super.validate(new ScheduleRules(entity));
  }
}

export class ScheduleValidatorFactory {
 static create() {
   return new ScheduleValidator();
 }
}

