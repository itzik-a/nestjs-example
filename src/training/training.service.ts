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
    // const subject = new Subject()
    // subject.name = 'Math'
    const subject = await this.subjectRepo.findOne(2)

    // const teacher1 = new Teacher()
    // teacher1.name = 'John Doe'

    // const teacher2 = new Teacher()
    // teacher2.name = 'Harry Doe'

    // subject.teachers = [teacher1, teacher2]
    // await this.teacherRepo.save([teacher1, teacher2])
    const teacher1 = await this.teacherRepo.findOne(1)
    const teacher2 = await this.teacherRepo.findOne(2)
    return await this.subjectRepo
      .createQueryBuilder()
      .relation(Subject, 'teachers')
      .of(subject)
      .add([teacher1, teacher2])
  }

  async removeRelation() {
    // const subject = await this.subjectRepo.findOne(1, {
    //   relations: ['teachers'],
    // })
    // subject.teachers = subject.teachers.filter((teacher) => teacher.id !== 2)
    // await this.subjectRepo.save(subject)
    await this.subjectRepo
      .createQueryBuilder('s')
      .update()
      .set({ name: 'Confidential' })
      .execute()
  }
}
