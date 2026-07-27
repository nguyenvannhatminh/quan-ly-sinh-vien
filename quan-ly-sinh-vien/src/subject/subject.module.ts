import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from './subject.controller';
import { SubjectService } from './subject.service';
import { SUBJECT } from '../entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SUBJECT])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
