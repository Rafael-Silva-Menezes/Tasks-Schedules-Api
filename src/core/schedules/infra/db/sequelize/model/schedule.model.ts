import { TasksModel } from '@core/tasks/infra/db/sequelize/model/tasks.model';
import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type ScheduleModelProps = {
  scheduleId: string;
  accountId: string;
  agentId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
};

@Table({ tableName: 'schedules', timestamps: false })
export class ScheduleModel extends Model<ScheduleModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID, field: 'schedule_id' })
  declare scheduleId: string;

  @Column({ type: DataType.UUID, field: 'account_id' })
  declare accountId: string;

  @Column({ allowNull: true, type: DataType.UUID, field: 'agent_id' })
  declare agentId: string | null;

  @Column({ allowNull: true, type: DataType.DATE(3), field: 'start_time' })
  declare startTime: Date | null;

  @Column({ allowNull: true, type: DataType.DATE(3), field: 'end_time' })
  declare endTime: Date | null;

  @Column({ allowNull: false, type: DataType.DATE(3), field: 'created_at' })
  declare createdAt: Date;

  @HasMany(() => TasksModel, 'scheduleId')
  declare tasks: TasksModel[];
}
