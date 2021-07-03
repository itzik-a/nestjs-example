import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('APP_NAME') private readonly name: string,
    @Inject('MESSAGE') private readonly message: string,
  ) {}

  getHello(): string {
    return `Hajimemashite from ${this.name}, ${this.message}`
  }

  getBye() {
    return `Bye in japanese from ${this.name}`
  }
}
