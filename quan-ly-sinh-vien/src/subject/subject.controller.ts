import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { CreateSubjectDto } from './dto/create-subject.dto';

@Controller('subject')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  async create(@Body() body: CreateSubjectDto) {
    return await this.subjectService.create(body);
  }

  @Get()
  async findAll() {
    return await this.subjectService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateSubjectDto) {
    return await this.subjectService.update(id, body);
  }

  @Delete(':id')
  async xoa(@Param('id', ParseIntPipe) id: number) {
    return await this.subjectService.xoa(id);
  }
}
