import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Teacher } from './teacher.entity'
import { Subject } from './subject.entity'
import { TrainingController } from './training.controller'
import { TrainingService } from './training.service'

@Module({
  imports: [TypeOrmModule.forFeature([Subject, Teacher])],
  controllers: [TrainingController],
  providers: [TrainingService],
})
export class TrainingModule {}
