import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common'
import { CreateEventDto } from './input/create-event.dto'
import { EventsService } from './events.service'
import { UpdateEventDto } from './input/update-event.dto'
import { ListEvents } from './input/list.events'

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  private readonly logger = new Logger(EventsController.name)

  @Get()
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(filter)
    const events = await this.eventsService.getEventsWithAttendeeCountFiltered(
      filter,
    )
    this.logger.debug(`Found ${events.length} events`)
    return events
  }

  @Get('practice')
  practice() {
    return this.eventsService.practice()
  }

  @Get('practice2')
  async practice2() {
    return await this.eventsService.practice2()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventsService.findOne(id)

    if (!event) {
      throw new NotFoundException()
    }
    return event
  }

  @Post()
  async create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
  ) {
    return await this.eventsService.create(input)
  }

  @Patch(':id')
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
  ) {
    return await this.eventsService.update(id, input)
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    await this.eventsService.remove(id)
  }
}
