import { Module } from '@nestjs/common';
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
