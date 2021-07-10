import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { EventsService } from './events.service'
import { UpdateEventDto } from './update-event.dto'

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  private readonly logger = new Logger(EventsController.name)

  @Get()
  async findAll() {
    this.logger.log('Hit the findAll route')
    const events = await this.eventsService.findAll()
    this.logger.debug(`Found ${events.length} events`)
    return events
  }

  @Get('practice')
  practice() {
    return this.eventsService.practice()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id) {
    return this.eventsService.findOne(id)
  }

  @Post()
  create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
  ) {
    return this.eventsService.create(input)
  }

  @Patch(':id')
  update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
  ) {
    return this.eventsService.update(id, input)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.eventsService.remove(id)
  }
}
