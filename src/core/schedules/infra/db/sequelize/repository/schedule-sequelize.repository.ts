import { Schedule } from '@core/schedules/domain/entities/schedule.entity';
import {
  IScheduleRepository,
  ScheduleSearchParams,
  ScheduleSearchResult,
} from '@core/schedules/domain/interfaces/schedule.repository';
import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { Op } from 'sequelize';
import { ScheduleModelMapper } from '../model/schedule-mapper.model';
import { ScheduleModel } from '../model/schedule.model';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';

export class ScheduleSequelizeRepository implements IScheduleRepository {
  sortableFields: string[] = ['createdAt'];

  constructor(private scheduleModel: typeof ScheduleModel) {}
  async insert(schedule: Schedule): Promise<void> {
    const modelProps = ScheduleModelMapper.toModel(schedule);
    await this.scheduleModel.create(modelProps.toJSON());
  }
  async bulkInsert(schedules: Schedule[]): Promise<void> {
    const modelsProps = schedules.map((schedule) =>
      ScheduleModelMapper.toModel(schedule).toJSON(),
    );
    await this.scheduleModel.bulkCreate(modelsProps);
  }
  async update(schedule: Schedule): Promise<void> {
    const id = schedule.getScheduleId().id;

    const modelProps = ScheduleModelMapper.toModel(schedule);
    const [affectedRows] = await this.scheduleModel.update(
      modelProps.toJSON(),
      {
        where: { scheduleId: schedule.getScheduleId().id },
      },
    );

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }
  async delete(scheduleId: Uuid): Promise<void> {
    const id = scheduleId.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.scheduleModel.destroy({
      where: { scheduleId: id },
    });
  }

  async findById(entityId: Uuid): Promise<Schedule | null> {
    const model = await this._get(entityId.id);
    return model ? ScheduleModelMapper.toEntity(model) : null;
  }
  async findAll(): Promise<Schedule[]> {
    const models = await this.scheduleModel.findAll();
    return models.map((model) => {
      return ScheduleModelMapper.toEntity(model);
    });
  }
  getEntity(): new (...args: any[]) => Schedule {
    return Schedule;
  }

  async search(props: ScheduleSearchParams): Promise<ScheduleSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.scheduleModel.findAndCountAll({
      ...(props.filter && {
        where: {
          [Op.or]: [
            { accountId: { [Op.like]: `%${props.filter}%` } },
            { agentId: { [Op.like]: `%${props.filter}%` } },
          ],
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: [[props.sort, props.sort_dir]] }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });

    return new ScheduleSearchResult({
      items: models.map((model) => {
        return ScheduleModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private async _get(id: string) {
    return await this.scheduleModel.findByPk(id);
  }
}
