import { Controller, Logger, Post } from '@nestjs/common'
import { TrainingService } from './training.service'

@Controller('training')
export class TrainingController {
  constructor(private trainingService: TrainingService) {}

  private readonly logger = new Logger(TrainingController.name)

  @Post('create')
  public async createSubject() {
    return await this.trainingService.createSubject()
  }

  @Post('remove')
  public async removeRelation() {
    await this.trainingService.removeRelation()
  }
}
