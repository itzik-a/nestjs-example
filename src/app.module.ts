import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppDummy } from './app.dummy'
import { AppJapanService } from './app.japan.service'
import { AppService } from './app.service'
import { Event } from './events/event.entity'
import { EventsModule } from './events/events.module'

const isJapanese = true
const APP_SERVICE_CLASS = isJapanese ? AppJapanService : AppService

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'example',
      database: 'nest-event',
      entities: [Event],
      synchronize: true, // careful - this syncs db schema with entities
    }),
    EventsModule,
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
