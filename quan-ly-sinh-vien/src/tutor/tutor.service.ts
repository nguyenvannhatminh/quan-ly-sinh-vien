import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TUTOR } from '../entities/tutor.entity';
import { CreateTutorDto } from './dto/create-tutor.dto';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(TUTOR)
    private readonly tutorRepository: Repository<TUTOR>,
  ) {}

  async create(data: CreateTutorDto): Promise<TUTOR> {
    const newTutor = this.tutorRepository.create(data);
    return await this.tutorRepository.save(newTutor);
  }

  async findAll(): Promise<TUTOR[]> {
    return await this.tutorRepository.find();
  }

  async findOne(id: number): Promise<TUTOR> {
    const tutor = await this.tutorRepository.findOne({ where: { TID: id } });
    if (!tutor) throw new NotFoundException(`Không tìm thấy giảng viên ID: ${id}`);
    return tutor;
  }

  async update(id: number, data: CreateTutorDto): Promise<TUTOR> {
    const tutor = await this.findOne(id);
    Object.assign(tutor, data);
    return await this.tutorRepository.save(tutor);
  }

  async xoa(id: number): Promise<string> {
    const tutor = await this.findOne(id);
    await this.tutorRepository.remove(tutor);
    return `Đã xóa thành công giảng viên ID: ${id}`;
  }
}
