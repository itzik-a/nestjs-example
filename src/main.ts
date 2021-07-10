// import { ValidationPipe } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  })

  const logger = new Logger('main.ts')
  // app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
  logger.debug('Server running on port 3000')
}
bootstrap()
