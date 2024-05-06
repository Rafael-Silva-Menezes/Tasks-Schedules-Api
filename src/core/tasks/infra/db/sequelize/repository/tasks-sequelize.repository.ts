import { Uuid } from '@core/shared/domain/value-objects/uuid-value-object';
import { literal, Op } from 'sequelize';
import { NotFoundError } from '@core/shared/domain/errors/not-found.error';
import { SortDirection } from '@core/shared/domain/repository/search/search-params';
import {
  ITasksRepository,
  TasksSearchParams,
  TasksSearchResult,
} from '@core/tasks/domain/interfaces/tasks.repository';
import { TasksModel } from '../model/tasks.model';
import { TasksModelMapper } from '../model/tasks-mapper.model';
import { Tasks } from '@core/tasks/domain/entities/tasks.entity';

export class TasksSequelizeRepository implements ITasksRepository {
  sortableFields: string[] = ['createdAt'];
  orderBy = {
    posts: {
      name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`),
    },
  };
  constructor(private tasksModel: typeof TasksModel) {}
  async insert(tasks: Tasks): Promise<void> {
    const modelProps = TasksModelMapper.toModel(tasks);
    await this.tasksModel.create(modelProps.toJSON());
  }
  async bulkInsert(tasks: Tasks[]): Promise<void> {
    const modelsProps = tasks.map((tasks) =>
      TasksModelMapper.toModel(tasks).toJSON(),
    );
    await this.tasksModel.bulkCreate(modelsProps);
  }
  async update(tasks: Tasks): Promise<void> {
    const id = tasks.getTasksId().id;

    const modelProps = TasksModelMapper.toModel(tasks);

    const [affectedRows] = await this.tasksModel.update(modelProps.toJSON(), {
      where: { tasksId: tasks.getTasksId().id },
    });

    if (affectedRows !== 1) {
      throw new NotFoundError(id, this.getEntity());
    }
  }
  async delete(tasksId: Uuid): Promise<void> {
    const id = tasksId.id;
    const model = await this._get(id);
    if (!model) {
      throw new NotFoundError(id, this.getEntity());
    }

    await this.tasksModel.destroy({
      where: { tasksId: id },
    });
  }

  async findById(entityId: Uuid): Promise<Tasks | null> {
    const model = await this._get(entityId.id);
    return model ? TasksModelMapper.toEntity(model) : null;
  }
  async findAll(): Promise<Tasks[]> {
    const models = await this.tasksModel.findAll();
    return models.map((model) => {
      return TasksModelMapper.toEntity(model);
    });
  }
  getEntity(): new (...args: any[]) => Tasks {
    return Tasks;
  }

  async search(props: TasksSearchParams): Promise<TasksSearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.tasksModel.findAndCountAll({
      ...(props.filter && {
        where: {
          type: { [Op.like]: `%${props.filter}%` },
        },
      }),
      ...(props.sort && this.sortableFields.includes(props.sort)
        ? { order: this.formatSort(props.sort, props.sort_dir) }
        : { order: [['createdAt', 'desc']] }),
      offset,
      limit,
    });

    return new TasksSearchResult({
      items: models.map((model) => {
        return TasksModelMapper.toEntity(model);
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  private formatSort(sort: string, sort_dir: SortDirection) {
    const dialect = this.tasksModel.sequelize.getDialect() as 'mysql';
    if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
      return this.orderBy[dialect][sort](sort_dir);
    }
    return [[sort, sort_dir]];
  }

  private async _get(id: string) {
    return await this.tasksModel.findByPk(id);
  }
}
