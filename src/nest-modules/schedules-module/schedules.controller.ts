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
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { CreateScheduleUseCase } from '@core/schedules/application/usecases/create-usecase/create-schedule.use-case';
import { DeleteScheduleUseCase } from '@core/schedules/application/usecases/delete-usecase/delete-schedule.use-case';
import { GetScheduleUseCase } from '@core/schedules/application/usecases/get-usecase/get-schedule.use-case';
import { UpdateScheduleUseCase } from '@core/schedules/application/usecases/update-usecase/update-schedule.use-case';
import { ListScheduleUseCase } from '@core/schedules/application/usecases/list-usecase/list-schedule.use-case';
import { ScheduleOutput } from '@core/schedules/application/usecases/common/schedule.use-case.mapper.types';
import {
  ScheduleCollectionPresenter,
  SchedulePresenter,
} from './schedules.presenter';
import { SearchSchedulesDto } from './dto/search-schedules.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('schedules')
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
  async search(@Query() searchParamsDto: SearchSchedulesDto) {
    const output = await this.listUseCase.execute(searchParamsDto);
    return new ScheduleCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });
    return SchedulesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateScheduleDto,
      id,
    });
    return SchedulesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    return await this.deleteUseCase.execute({ id });
  }

  static serialize(output: ScheduleOutput) {
    return new SchedulePresenter(output);
  }
}
