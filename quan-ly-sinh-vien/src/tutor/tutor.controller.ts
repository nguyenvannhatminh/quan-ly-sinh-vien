import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { CreateTutorDto } from './dto/create-tutor.dto';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  async create(@Body() body: CreateTutorDto) {
    return await this.tutorService.create(body);
  }

  @Get()
  async findAll() {
    return await this.tutorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tutorService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateTutorDto) {
    return await this.tutorService.update(id, body);
  }

  @Delete(':id')
  async xoa(@Param('id', ParseIntPipe) id: number) {
    return await this.tutorService.xoa(id);
  }
}
