import { Module } from '@nestjs/common';
import { DatabaseModule } from './nest-modules/database/database.module';
import { SchedulesModule } from './nest-modules/schedules/schedules.module';
import { ConfigModule } from './nest-modules/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, SchedulesModule],
})
export class AppModule {}
