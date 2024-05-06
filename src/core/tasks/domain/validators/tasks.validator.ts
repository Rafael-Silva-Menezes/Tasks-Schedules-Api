import { ClassValidatorFields } from '@core/shared/domain/validators/class-fields.validator';
import { Notification } from '@core/shared/domain/validators/notification';
import { TasksRules } from './tasks-rules.validator';

export class TasksValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['type'];
    return super.validate(notification, new TasksRules(data), newFields);
  }
}

export class TasksValidatorFactory {
  static create() {
    return new TasksValidator();
  }
}
