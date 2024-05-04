import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleUseCase } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case';
import { DeleteScheduleUseCase } from '@core/schedules/application/usecases/delete-usecase/delete-schedule.use-case';
import { GetScheduleUseCase } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case';
import { UpdateScheduleUseCase } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case';
import { ListScheduleUseCase } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case';
import { ScheduleOutput } from '@core/schedules/application/usecases/common/schedule.use-case.mapper.types';
import { SchedulePresenter } from './schedules.presenter';

@Controller('schedules')
export class SchedulesController {
  @Inject(CreateScheduleUseCase)
  private createUseCase: CreateScheduleUseCase;

  @Inject(UpdateScheduleUseCase)
  private updateUseCase: UpdateScheduleUseCase;

  @Inject(DeleteScheduleUseCase)
  private deleteUseCase: DeleteScheduleUseCase;

  @Inject(GetScheduleUseCase)
  private getUseCase: GetScheduleUseCase;

  @Inject(ListScheduleUseCase)
  private listUseCase: ListScheduleUseCase;

  @Post()
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    const output = await this.createUseCase.execute(createScheduleDto);
    return SchedulesController.serialize(output);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}

  static serialize(output: ScheduleOutput) {
    return new SchedulePresenter(output);
  }
}
