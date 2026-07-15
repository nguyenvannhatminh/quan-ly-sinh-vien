import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVienController } from './sinh-vien.controller';
import { SinhVienService } from './sinh-vien.service';
import { STUDENT } from '../entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([STUDENT])],
  controllers: [SinhVienController],
  providers: [SinhVienService],
})
export class SinhVienModule {}
