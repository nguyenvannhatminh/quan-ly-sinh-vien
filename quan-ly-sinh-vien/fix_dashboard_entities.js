const fs = require('fs');

// 1. Ghi đè file Dashboard Controller với các Entity chuẩn của hệ thống
const controllerCode = `import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SinhVien } from '../sinh-vien/entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(SinhVien) private studentRepo: Repository<SinhVien>,
    @InjectRepository(Tutor) private tutorRepo: Repository<Tutor>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
  ) {}

  @Get('stats')
  async getStats() {
    const totalStudents = await this.studentRepo.count();
    const totalTutors = await this.tutorRepo.count();
    const totalSubjects = await this.subjectRepo.count();

    let chartData = [];
    try {
      // Quét chuẩn thực thể SinhVien và liên kết môn học
      const students = await this.studentRepo.find({ relations: { subjects: true } });
      const allSubjects = await this.subjectRepo.find();
      const subjectCounts = {};
      
      // Khởi tạo danh sách môn học bảo vệ chống lỗi font/trường dữ liệu
      allSubjects.forEach(s => {
        const name = s['name'] || s['tenMonHoc'] || s['tenMon'] || 'Chưa rõ';
        subjectCounts[name] = 0;
      });

      // Đếm số lượng sinh viên thực tế đăng ký từng môn
      students.forEach(st => {
        if (st.subjects && Array.isArray(st.subjects)) {
          st.subjects.forEach(sub => {
            const name = sub['name'] || sub['tenMonHoc'] || sub['tenMon'] || 'Chưa rõ';
            if (subjectCounts[name] !== undefined) {
              subjectCounts[name] += 1;
            } else {
              subjectCounts[name] = 1;
            }
          });
        }
      });

      chartData = Object.keys(subjectCounts).map(name => ({
        subjectName: name,
        count: subjectCounts[name]
      }));
    } catch (e) {
      console.error('Lỗi tính toán biểu đồ:', e);
      try {
        const allSubjects = await this.subjectRepo.find();
        chartData = allSubjects.map(s => ({
          subjectName: s['name'] || s['tenMonHoc'] || s['tenMon'] || 'Chưa rõ',
          count: 0
        }));
      } catch (err) {
        chartData = [];
      }
    }

    return { totalStudents, totalTutors, totalSubjects, chartData };
  }
}
`;

fs.writeFileSync('./src/dashboard/dashboard.controller.ts', controllerCode);
console.log('✅ Đã sửa đổi DashboardController sang Entity chuẩn [SinhVien, Tutor, Subject]!');

// 2. Ghi đè file Dashboard Module để khai báo TypeOrm chuẩn
const moduleCode = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { SinhVien } from '../sinh-vien/entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SinhVien, Tutor, Subject])],
  controllers: [DashboardController],
})
export class DashboardModule {}
`;

fs.writeFileSync('./src/dashboard/dashboard.module.ts', moduleCode);
console.log('✅ Đã cập nhật DashboardModule đồng bộ!');

console.log('🚀 Đã xử lý xong xuôi! Hãy khởi động lại ứng dụng NestJS.');
