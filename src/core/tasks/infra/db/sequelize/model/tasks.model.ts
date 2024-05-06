import { ScheduleModel } from '@core/schedules/infra/db/sequelize/model/schedule.model';
import { TasksType } from '@core/tasks/domain/interfaces/tasks.types';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type TasksModelProps = {
  tasksId: string;
  scheduleId: string;
  accountId: string;
  startTime: Date | null;
  duration: number | null;
  type: string;
  createdAt: Date;
};

@Table({ tableName: 'tasks', timestamps: false })
export class TasksModel extends Model<TasksModelProps> {
  @PrimaryKey
  @Column({ allowNull: false, type: DataType.UUID, field: 'tasks_id' })
  declare tasksId: string;

  @ForeignKey(() => ScheduleModel)
  @Column({ type: DataType.UUID, field: 'schedule_id' })
  declare scheduleId: string;

  @Column({ type: DataType.UUID, field: 'account_id' })
  declare accountId: string;

  @Column({ allowNull: true, type: DataType.INTEGER, field: 'duration' })
  declare duration: number | null;

  @Column({ allowNull: true, type: DataType.DATE(3), field: 'start_time' })
  declare startTime: Date | null;

  @Column({ type: DataType.ENUM(...Object.values(TasksType)), field: 'type' })
  declare type: TasksType;

  @Column({ allowNull: false, type: DataType.DATE(3), field: 'created_at' })
  declare createdAt: Date;
}
