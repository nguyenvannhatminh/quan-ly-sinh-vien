import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { STUDENT } from '../entities/student.entity';

@Injectable()
export class SinhVienService {
  constructor(
    @InjectRepository(STUDENT)
    private readonly studentRepository: Repository<STUDENT>,
  ) {}

  // 1. Lấy toàn bộ danh sách sinh viên
  async layDanhSach(): Promise<STUDENT[]> {
    return await this.studentRepository.find();
  }

  // 2. Lấy chi tiết 1 sinh viên theo SID
  async layChiTiet(sid: string): Promise<STUDENT> {
    const sinhVien = await this.studentRepository.findOneBy({ SID: sid });
    if (!sinhVien) {
      throw new NotFoundException(`Không tìm thấy sinh viên có mã SID: ${sid}`);
    }
    return sinhVien;
  }

  // 3. Thêm mới sinh viên
  async themMoi(duLieuMoi: STUDENT): Promise<STUDENT> {
    const sinhVienMoi = this.studentRepository.create(duLieuMoi);
    return await this.studentRepository.save(sinhVienMoi);
  }

  // 4. Cập nhật thông tin sinh viên
  async capNhat(sid: string, duLieuCapNhat: Partial<STUDENT>): Promise<STUDENT> {
    const sinhVien = await this.layChiTiet(sid);
    const sinhVienSauUpdate = this.studentRepository.merge(sinhVien, duLieuCapNhat);
    return await this.studentRepository.save(sinhVienSauUpdate);
  }

  // 5. Xóa sinh viên khỏi DB
  async xoa(sid: string): Promise<string> {
    const sinhVien = await this.layChiTiet(sid);
    await this.studentRepository.remove(sinhVien);
    return `Đã xóa thành công sinh viên có mã SID: ${sid}`;
  }
}
