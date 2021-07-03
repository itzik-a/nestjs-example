import { Injectable } from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from './update-event.dto'
import { Event } from './event.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  async findAll() {
    return await this.repository.find()
  }

  async findOne(id: string) {
    return await this.repository.findOne(id)
  }

  async create(input: CreateEventDto) {
    return await this.repository.save({
      ...input,
      date: new Date(input.date),
    })
  }

  async update(id: string, input: UpdateEventDto) {
    const event = await this.repository.findOne(id)
    return await this.repository.save({
      ...event,
      ...input,
      date: input.date ? new Date(input.date) : event.date,
    })
  }

  async remove(id: string) {
    const event = await this.repository.findOne(id)
    await this.repository.remove(event)
  }
}