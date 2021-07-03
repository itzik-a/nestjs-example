import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  constructor(@Inject('APP_NAME') private readonly name: string) {}

  getHello(): string {
    return `Hello world from ${this.name}`
  }

  getBye() {
    return `Bye from ${this.name}`
  }
}
