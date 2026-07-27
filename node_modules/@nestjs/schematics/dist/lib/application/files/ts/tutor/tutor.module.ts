import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { TUTOR } from '../entities/tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TUTOR])],
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {}
