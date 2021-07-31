import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { CreateEventDto } from './input/create-event.dto'
import { EventsService } from './events.service'
import { UpdateEventDto } from './input/update-event.dto'
import { ListEvents } from './input/list.events'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { AuthGuardJwt } from 'src/auth/auth-guard-jwt'
import { User } from 'src/auth/user.entity'

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  private readonly logger = new Logger(EventsController.name)

  @Get()
  @UsePipes(new ValidationPipe({ transform: true })) // populate default values for queries
  async findAll(@Query() filter: ListEvents) {
    this.logger.debug(`filter: ${filter}`)

    return await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      { total: true, currentPage: filter.page, limit: 3 },
    )
  }

  // @Get('practice')
  // practice() {
  //   return this.eventsService.practice()
  // }

  // @Get('practice2')
  // async practice2() {
  //   return await this.eventsService.practice2()
  // }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id) {
    const event = await this.eventsService.findOne(id)

    if (!event) {
      throw new NotFoundException()
    }
    return event
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(
    @Body(new ValidationPipe({ groups: ['create'] })) input: CreateEventDto,
    @CurrentUser() user: User,
  ) {
    return await this.eventsService.create(input, user)
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body(new ValidationPipe({ groups: ['update'] })) input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    return await this.eventsService.update(id, input, user)
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async deleteEvent(@Param('id') id, @CurrentUser() user: User) {
    const event = await this.eventsService.findOne(id)

    if (!event) {
      throw new NotFoundException()
    }

    if (user.id !== event.organizerId) {
      throw new ForbiddenException(
        null,
        'You are not authorized to delete this event',
      )
    }
    return await this.eventsService.deleteEvent(id)
  }
}
