import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SUBJECT } from '../entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(SUBJECT)
    private readonly subjectRepository: Repository<SUBJECT>,
  ) {}

  async create(data: CreateSubjectDto): Promise<SUBJECT> {
    const newSubject = this.subjectRepository.create(data);
    return await this.subjectRepository.save(newSubject);
  }

  async findAll(): Promise<SUBJECT[]> {
    return await this.subjectRepository.find();
  }

  async findOne(id: number): Promise<SUBJECT> {
    const subject = await this.subjectRepository.findOne({ where: { SubID: id } });
    if (!subject) throw new NotFoundException(`Không tìm thấy môn học ID: ${id}`);
    return subject;
  }

  async update(id: number, data: CreateSubjectDto): Promise<SUBJECT> {
    const subject = await this.findOne(id);
    Object.assign(subject, data);
    return await this.subjectRepository.save(subject);
  }

  async xoa(id: number): Promise<string> {
    const subject = await this.findOne(id);
    await this.subjectRepository.remove(subject);
    return `Đã xóa thành công môn học ID: ${id}`;
  }
}
