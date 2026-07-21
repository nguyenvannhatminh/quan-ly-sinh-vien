import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
  ) {}

  async create(createTutorDto: any) {
    const saved = await this.tutorRepository.save(createTutorDto);
    return { ...saved, id: saved.TID || (saved as any).id };
  }

  async findAll() {
    const data = await this.tutorRepository.find();
    // Tự động map thêm trường 'id' bằng giá trị của 'TID' để giao diện nhận diện được nút Sửa/Xóa
    return data.map(item => ({
      ...item,
      id: item.TID || (item as any).id
    }));
  }

  async findOne(id: number) {
    const item = await this.tutorRepository.findOne({
      where: [{ TID: id }, { id: id } as any]
    });
    if (item) {
      return { ...item, id: item.TID || (item as any).id };
    }
    return null;
  }

  async update(id: number, updateTutorDto: any) {
    // Loại bỏ các trường id để tránh lỗi bind khóa chính của TypeORM
    const { id: _, TID: __, ...updateData } = updateTutorDto;
    
    // Thử cập nhật theo cả 2 trường hợp cho chắc chắn
    await this.tutorRepository.update({ TID: id } as any, updateData).catch(() => {});
    await this.tutorRepository.update(id, updateData).catch(() => {});
    
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.tutorRepository.delete({ TID: id } as any).catch(() => {});
    await this.tutorRepository.delete(id).catch(() => {});
    return { success: true };
  }
}
