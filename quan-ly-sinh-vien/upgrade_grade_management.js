const fs = require('fs');

// 1. Nâng cấp file SinhVien Entity
const entityPath = './src/sinh-vien/entities/sinh-vien.entity.ts';
const entityCode = `import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('sinh_viens')
export class SinhVien {
  @PrimaryGeneratedColumn()
  SID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  // --- CÁC CỘT MỚI ĐƯỢC THÊM VÀO CHO TÍNH NĂNG ĐIỂM SỐ ---
  @Column({ type: 'json', nullable: true })
  diemSo: any;

  @Column({ type: 'float', nullable: true })
  gpa: number;

  @Column({ nullable: true })
  xepLoai: string;
  // -----------------------------------------------------

  @ManyToOne(() => Tutor)
  @JoinColumn({ name: 'tutorId' })
  tutor: Tutor;

  @ManyToMany(() => Subject)
  @JoinTable()
  subjects: Subject[];
}
`;

fs.writeFileSync(entityPath, entityCode);
console.log('✅ Đã thêm 3 cột [diemSo, gpa, xepLoai] vào Entity SinhVien!');

// 2. Nâng cấp file SinhVien Service để tự động tính điểm
const servicePath = './src/sinh-vien/sinh-vien.service.ts';
const serviceCode = `import { Injectable } from '@nestjs/common';
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

  // Hàm nội bộ tự động tính GPA và Xếp loại
  private calculateAcademic(diemSo: any): { gpa: number, xepLoai: string } {
    if (!diemSo || Object.keys(diemSo).length === 0) return { gpa: null, xepLoai: null };
    
    const scores = Object.values(diemSo).map(Number).filter(n => !isNaN(n));
    if (scores.length === 0) return { gpa: null, xepLoai: null };

    const total = scores.reduce((a, b) => a + b, 0);
    const gpa = Number((total / scores.length).toFixed(2));
    
    let xepLoai = 'Kém';
    if (gpa >= 9) xepLoai = 'Xuất sắc';
    else if (gpa >= 8) xepLoai = 'Giỏi';
    else if (gpa >= 6.5) xepLoai = 'Khá';
    else if (gpa >= 5) xepLoai = 'Trung bình';
    else xepLoai = 'Yếu';

    return { gpa, xepLoai };
  }

  async create(body: any) {
    const sv = this.svRepo.create({ name: body.name, email: body.email });
    
    // Xử lý điểm số nếu có truyền lên ngay từ lúc tạo
    if (body.diemSo) {
      sv.diemSo = body.diemSo;
      const { gpa, xepLoai } = this.calculateAcademic(body.diemSo);
      sv.gpa = gpa;
      sv.xepLoai = xepLoai;
    }

    if (body.tutorId) sv.tutor = { TID: body.tutorId } as any;
    if (body.subjectIds) sv.subjects = body.subjectIds.map(id => ({ SubID: id } as any));
    return this.svRepo.save(sv);
  }

  async findAll(page: number = 1, limit: number = 5, search: string = '') {
    const skip = (page - 1) * limit;
    const whereCondition = search 
      ? [
          { name: Like(\`%\${search}%\`) },
          { email: Like(\`%\${search}%\`) }
        ]
      : {};

    const [data, total] = await this.svRepo.findAndCount({
      where: whereCondition,
      relations: { tutor: true, subjects: true },
      order: { SID: 'DESC' },
      skip: skip,
      take: limit
    });

    return { data, total, page, lastPage: Math.ceil(total / limit) };
  }

  async update(id: number, body: any) {
    const sv = await this.svRepo.findOne({ 
      where: { SID: id }, 
      relations: { subjects: true } 
    });
    
    if (!sv) return null;
    if (body.name) sv.name = body.name;
    if (body.email) sv.email = body.email;
    
    // Xử lý cập nhật điểm
    if (body.diemSo !== undefined) {
      sv.diemSo = body.diemSo;
      const { gpa, xepLoai } = this.calculateAcademic(body.diemSo);
      sv.gpa = gpa;
      sv.xepLoai = xepLoai;
    }

    if (body.tutorId !== undefined) sv.tutor = body.tutorId ? { TID: body.tutorId } as any : null;
    if (body.subjectIds !== undefined) sv.subjects = body.subjectIds.map(id => ({ SubID: id } as any));
    
    return this.svRepo.save(sv);
  }

  async remove(id: number) {
    return this.svRepo.delete(id);
  }
}
`;

fs.writeFileSync(servicePath, serviceCode);
console.log('✅ Đã cập nhật logic tính GPA và Xếp loại tự động vào SinhVienService!');
