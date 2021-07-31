import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { InjectRepository } from '@nestjs/typeorm'
import { Strategy } from 'passport-local'
import { Repository } from 'typeorm'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super()
  }

  private readonly logger = new Logger(LocalStrategy.name)

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({ where: { username } })

    if (!user) {
      this.logger.debug(`User ${username} was not found`)
      throw new UnauthorizedException()
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for user ${username}`)
      throw new UnauthorizedException()
    }

    return user
  }
}
