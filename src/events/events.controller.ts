import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { EventsService } from './events.service'
import { UpdateEventDto } from './update-event.dto'

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id) {
    return this.eventsService.findOne(id)
  }

  @Post()
  create(@Body() input: CreateEventDto) {
    return this.eventsService.create(input)
  }

  @Patch(':id')
  update(@Param('id') id, @Body() input: UpdateEventDto) {
    return this.eventsService.update(id, input)
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id) {
    this.eventsService.remove(id)
  }
}
