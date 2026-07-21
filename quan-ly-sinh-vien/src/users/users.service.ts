import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { USER } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(USER)
    private usersRepository: Repository<USER>,
  ) {}

  // Hàm tạo user mới và mã hóa mật khẩu
  async create(username: string, password: string): Promise<USER> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword, // Lưu mật khẩu đã hash an toàn
    });
    
    return this.usersRepository.save(newUser);
  }

  // Hàm tìm kiếm user theo username phục vụ cho Đăng nhập
  async findOne(username: string): Promise<USER | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }
}
