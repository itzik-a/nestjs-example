import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from './update-event.dto'
import { Event } from './event.entity'
import { Like, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {}

  async findAll() {
    return await this.repository.find()
  }

  async practice() {
    return await this.repository.find({
      select: ['id', 'description'],
      where: [{ id: MoreThan(2) }, { description: Like('%#1%') }],
      take: 2,
      skip: 1,
      order: {
        id: 'DESC',
      },
    })
  }

  async findOne(id: number) {
    const event = await this.repository.findOne(id)
    if (!event) {
      throw new NotFoundException()
    }
    return event
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
    if (!event) {
      throw new NotFoundException()
    }
    await this.repository.remove(event)
  }
}
