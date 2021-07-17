import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateEventDto } from './input/create-event.dto'
import { UpdateEventDto } from './input/update-event.dto'
import { Event } from './event.entity'
import { Like, MoreThan, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Attendee, AttendeeAnswerEnum } from './attendee.entity'
import { ListEvents, WhenEventFilter } from './input/list.events'
import { paginate, PaginationOptions } from 'src/pagination/paginator'

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private readonly eventRepo: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepo: Repository<Attendee>,
  ) {}

  private readonly logger = new Logger(EventsService.name)

  private getEventsBaseQuery() {
    return this.eventRepo.createQueryBuilder('e').orderBy('e.id', 'DESC')
  }

  private getEventsWithAttendeeCountQuery() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      )
  }

  private getEventsWithAttendeeCountFiltered(filter?: ListEvents) {
    let query = this.getEventsWithAttendeeCountQuery()
    if (!filter) {
      return query
    }
    if (filter.when) {
      filter.when = Number(filter.when)
      this.logger.debug(`filter.when: ${filter.when}`)
      if (filter.when === WhenEventFilter.Today) {
        query = query.andWhere(
          'e.date >= CURDATE() AND e.date <= CURDATE() + INTERVAL 1 DAY',
        )
      }
      if (filter.when === WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          'e.date >= CURDATE() + INTERVAL 1 DAY AND e.date <= CURDATE() + INTERVAL 2 DAY',
        )
      }
      if (filter.when === WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.date, 1) = YEARWEEK(CURDATE(), 1)')
      }
      if (filter.when === WhenEventFilter.NextWeek) {
        query = query.andWhere(
          'YEARWEEK(e.date, 1) = YEARWEEK(CURDATE(), 1) + 1',
        )
      }
    }

    return query
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    paginationOptions: PaginationOptions,
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      paginationOptions,
    )
  }

  public async findAll(): Promise<Event[]> {
    const query = this.getEventsWithAttendeeCountQuery()
    this.logger.debug(query.getSql())
    return await query.getMany()
  }

  public async practice() {
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

  public async practice2() {
    const event = await this.eventRepo.findOne(2, { relations: ['attendees'] })
    const attendee = new Attendee()
    attendee.name = 'Snufkin using cascade'
    attendee.id = 36
    event.attendees.push(attendee)

    // await this.attendeeRepo.save(attendee)
    await this.eventRepo.save(event)
    return event
  }

  public async findOne(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    )
    this.logger.debug(query.getSql())

    return await query.getOne()
  }

  public async create(input: CreateEventDto) {
    return await this.eventRepo.save({
      ...input,
      date: new Date(input.date),
    })
  }

  public async update(id: string, input: UpdateEventDto) {
    const event = await this.eventRepo.findOne(id)
    return await this.eventRepo.save({
      ...event,
      ...input,
      date: input.date ? new Date(input.date) : event.date,
    })
  }

  public async remove(id: string) {
    const event = await this.eventRepo.findOne(id)
    if (!event) {
      throw new NotFoundException()
    }
    await this.eventRepo.remove(event)
  }
}
