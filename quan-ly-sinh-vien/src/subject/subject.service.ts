import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  create(createSubjectDto: any) {
    return this.subjectRepository.save(createSubjectDto);
  }

  findAll() {
    return this.subjectRepository.find();
  }

  findOne(id: number) {
    return this.subjectRepository.findOne({ where: { SubID: id } as any });
  }

  update(id: number, updateSubjectDto: any) {
    return this.subjectRepository.update({ SubID: id } as any, updateSubjectDto);
  }

  remove(id: number) {
    return this.subjectRepository.delete({ SubID: id } as any);
  }
}
