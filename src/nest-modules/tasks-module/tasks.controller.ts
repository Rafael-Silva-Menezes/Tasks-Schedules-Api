import { CreateTasksUseCase } from '@core/tasks/application/create-usecase/create-tasks.use-case';
import { DeleteTasksUseCase } from '@core/tasks/application/delete-usecase/delete-tasks.use-case';
import { GetTasksUseCase } from '@core/tasks/application/get-usecase/get-tasks.use-case';
import { ListTasksUseCase } from '@core/tasks/application/list-usecase/list-tasks.use-case';
import { UpdateTasksUseCase } from '@core/tasks/application/update-usecase/update-tasks.use-case';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TasksCollectionPresenter, TasksPresenter } from './tasks.presenter';
import { CreateTasksDto } from './dto/create-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { UpdateTasksDto } from './dto/update-task.dto';
import { TasksOutput } from '@core/tasks/application/common/tasks.use-case.mapper.types';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  @Inject(CreateTasksUseCase)
  private createUseCase: CreateTasksUseCase;

  @Inject(UpdateTasksUseCase)
  private updateUseCase: UpdateTasksUseCase;

  @Inject(DeleteTasksUseCase)
  private deleteUseCase: DeleteTasksUseCase;

  @Inject(GetTasksUseCase)
  private getUseCase: GetTasksUseCase;

  @Inject(ListTasksUseCase)
  private listUseCase: ListTasksUseCase;

  @Post()
  async create(@Body() createTasksDto: CreateTasksDto) {
    const output = await this.createUseCase.execute(createTasksDto);
    return TasksController.serialize(output);
  }

  @Get()
  async search(@Query() searchParamsDto: SearchTasksDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new TasksCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return TasksController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateTasksDto: UpdateTasksDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateTasksDto,
      id,
    });
    return TasksController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return await this.deleteUseCase.execute({ id });
  }

  static serialize(output: TasksOutput) {
    return new TasksPresenter(output);
  }
}
