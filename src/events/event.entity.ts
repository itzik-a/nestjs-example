import { User } from 'src/auth/user.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Attendee } from './attendee.entity'

@Entity({ name: 'event' })
export class Event {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 100 })
  name: string

  @Column()
  description: string

  @Column()
  date: Date

  @Column()
  address: string

  @OneToMany(() => Attendee, (attendee) => attendee.event, { cascade: true })
  attendees: Attendee[]

  @ManyToOne(() => User, (user) => user.organized)
  organizer: User

  // No Column decorator, so they don't get saved in the DB
  attendeeCount?: number
  attendeeRejected?: number
  attendeeMaybe?: number
  attendeeAccepted?: number
}
