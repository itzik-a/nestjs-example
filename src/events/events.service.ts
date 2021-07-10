import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from './update-event.dto'
import { Event } from './event.entity'
import { Like, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Attendee } from './attendee.entity'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepo: Repository<Attendee>,
  ) {}

  async findAll() {
    return await this.eventRepo.find()
  }

  async practice() {
    return await this.eventRepo.find({
      select: ['id', 'description'],
      where: [{ id: MoreThan(2) }, { description: Like('%#1%') }],
      take: 2,
      skip: 1,
      order: {
        id: 'DESC',
      },
    })
  }

  async practice2() {
    // return await this.eventRepo.findOne(1, { relations: ['attendees'] })
    const event = await this.eventRepo.findOne(1, { relations: ['attendees'] })
    const attendee = new Attendee()
    attendee.name = 'Jerry using cascade'
    event.attendees.push(attendee)

    await this.eventRepo.save(event)

    return event
  }

  async findOne(id: number) {
    const event = await this.eventRepo.findOne(id)
    if (!event) {
      throw new NotFoundException()
    }
    return event
  }

  async create(input: CreateEventDto) {
    return await this.eventRepo.save({
      ...input,
      date: new Date(input.date),
    })
  }

  async update(id: string, input: UpdateEventDto) {
    const event = await this.eventRepo.findOne(id)
    return await this.eventRepo.save({
      ...event,
      ...input,
      date: input.date ? new Date(input.date) : event.date,
    })
  }

  async remove(id: string) {
    const event = await this.eventRepo.findOne(id)
    if (!event) {
      throw new NotFoundException()
    }
    await this.eventRepo.remove(event)
  }
}
