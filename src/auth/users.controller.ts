import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthService } from './auth.service'
import { CreateUserDto } from './input/create-user.dto'
import { User } from './user.entity'

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    const user = new User()

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException(['Passwords are not identical'])
    }

    const existingUser = await this.userRepo.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    })

    if (existingUser) {
      throw new BadRequestException(['Username or email is already taken'])
    }

    user.email = createUserDto.email
    user.firstName = createUserDto.firstName
    user.lastName = createUserDto.lastName
    user.username = createUserDto.username
    user.password = await this.authService.hashPassword(createUserDto.password)

    return {
      ...(await this.userRepo.save(user)),
      token: this.authService.getTokenForUser(user),
    }
  }
}
