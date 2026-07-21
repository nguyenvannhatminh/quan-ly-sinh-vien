import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { Tutor } from './entities/tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor])],
  controllers: [TutorController],
  providers: [TutorService],
  exports: [TutorService],
})
export class TutorModule {}
