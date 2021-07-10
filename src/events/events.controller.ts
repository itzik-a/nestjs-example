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
  async findOne(@Param('id', ParseIntPipe) id) {
    return await this.eventsService.findOne(id)
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
