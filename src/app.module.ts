import { Module } from '@nestjs/common';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { SchedulesModule } from './nest-modules/schedules-module/schedules.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { SharedModule } from './nest-modules/shared-module/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    SchedulesModule,
    SharedModule,
  ],
})
export class AppModule {}
