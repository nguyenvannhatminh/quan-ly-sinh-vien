import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LopHocService } from './lop-hoc.service';
import { LopHocController } from './lop-hoc.controller';
import { LopHoc } from './entities/lop-hoc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LopHoc])],
  controllers: [LopHocController],
  providers: [LopHocService],
})
export class LopHocModule {}