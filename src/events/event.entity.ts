import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
