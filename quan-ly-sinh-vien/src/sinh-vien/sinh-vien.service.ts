import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SinhVien } from './entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectRepository(SinhVien) private svRepo: Repository<SinhVien>,
    @InjectRepository(Tutor) private tutorRepo: Repository<Tutor>,
    @InjectRepository(Subject) private subRepo: Repository<Subject>,
  ) {}

  async create(body: any) {
    const sv = this.svRepo.create({ name: body.name, email: body.email });
    if (body.tutorId) sv.tutor = { TID: body.tutorId } as any;
    if (body.subjectIds) sv.subjects = body.subjectIds.map(id => ({ SubID: id } as any));
    return this.svRepo.save(sv);
  }

  // Hàm findAll cải tiến hỗ trợ Phân trang & Tìm kiếm
  async findAll(page: number = 1, limit: number = 5, search: string = '') {
    const skip = (page - 1) * limit;
    
    // Nếu có từ khóa tìm kiếm, áp dụng tìm theo cả Name HOẶC Email
    const whereCondition = search 
      ? [
          { name: Like(`%${search}%`) },
          { email: Like(`%${search}%`) }
        ]
      : {};

    const [data, total] = await this.svRepo.findAndCount({
      where: whereCondition,
      relations: ['tutor', 'subjects'],
      order: { SID: 'DESC' }, // Sinh viên mới tạo lên đầu
      skip: skip,
      take: limit
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    };
  }

  async update(id: number, body: any) {
    const sv = await this.svRepo.findOne({ where: { SID: id }, relations: ['subjects'] });
    if (!sv) return null;
    sv.name = body.name;
    sv.email = body.email;
    sv.tutor = body.tutorId ? { TID: body.tutorId } as any : null;
    if (body.subjectIds) sv.subjects = body.subjectIds.map(id => ({ SubID: id } as any));
    return this.svRepo.save(sv);
  }

  async remove(id: number) {
    return this.svRepo.delete(id);
  }
}
