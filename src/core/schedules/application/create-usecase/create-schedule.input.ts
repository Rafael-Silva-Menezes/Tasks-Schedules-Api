import {
 IsBoolean,
 IsDate,
 IsNotEmpty,
 IsOptional,
 IsString,
 validateSync,
} from "class-validator";
import { ScheduleInput } from "../common/schedule.use-case.mapper.types";

export type CreateScheduleInputConstructorProps = ScheduleInput

export class CreateScheduleInput {
 
 @IsString()
 @IsNotEmpty()
 accountId: string;
 @IsString()
 @IsOptional()
 agentId?: string;

 @IsDate()
 @IsOptional()
 startTime?: Date;

 @IsDate()
 @IsOptional()
 endTime?:Date;



 constructor(props: CreateScheduleInputConstructorProps) {
   if (!props) return;
   this.accountId = props.accountId;
   this.agentId = props.agentId;
   this.endTime = props.endTime;
   this.startTime = props.startTime;

 }
}

export class ValidateCreateScheduleInput {
 static validate(input: CreateScheduleInput) {
   return validateSync(input);
 }
}
