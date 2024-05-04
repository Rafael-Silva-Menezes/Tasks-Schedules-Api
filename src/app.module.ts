import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, SchedulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
