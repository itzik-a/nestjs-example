import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Subject } from './subject.entity'
import { Teacher } from './teacher.entity'

@Injectable()
export class TrainingService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}
  private readonly logger = new Logger(TrainingService.name)

  async createSubject() {
    const subject = new Subject()
    subject.name = 'Math'

    const teacher1 = new Teacher()
    teacher1.name = 'John Doe'

    const teacher2 = new Teacher()
    teacher2.name = 'Harry Doe'

    subject.teachers = [teacher1, teacher2]

    return await this.subjectRepo.save(subject)
  }

  async removeRelation() {
    const subject = await this.subjectRepo.findOne(1, {
      relations: ['teachers'],
    })
    subject.teachers = subject.teachers.filter((teacher) => teacher.id !== 2)
    await this.subjectRepo.save(subject)
  }
}
