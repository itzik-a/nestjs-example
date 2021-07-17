import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppDummy } from './app.dummy'
import { AppJapanService } from './app.japan.service'
import { AppService } from './app.service'
import ormConfig from './config/orm.config'
import ormConfigProd from './config/orm.config.prod'
import { EventsModule } from './events/events.module'
import { TrainingModule } from './training/training.module';

const isJapanese = true
const APP_SERVICE_CLASS = isJapanese ? AppJapanService : AppService

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // this is the default
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    EventsModule,
    TrainingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: AppService,
      useClass: APP_SERVICE_CLASS,
    },
    { provide: 'APP_NAME', useValue: 'Nest Events Backend' },
    {
      provide: 'MESSAGE',
      inject: [AppDummy],
      useFactory: (app) => `${app.dummy()} Factory`,
    },
    AppDummy,
  ],
})
export class AppModule {}
