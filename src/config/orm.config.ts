import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Attendee } from 'src/events/attendee.entity'
import { Event } from 'src/events/event.entity'
import { Teacher } from 'src/training/teacher.entity'
import { Subject } from 'src/training/subject.entity'
import { Profile } from 'src/auth/profile.entity'
import { User } from 'src/auth/user.entity'

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee, Teacher, Subject, User, Profile],
    synchronize: true, // careful - this syncs db schema with entities
  }),
)
