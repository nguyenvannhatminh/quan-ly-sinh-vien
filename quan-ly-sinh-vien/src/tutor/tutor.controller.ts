import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TutorService } from './tutor.service';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Post()
  create(@Body() createTutorDto: any) {
    return this.tutorService.create(createTutorDto);
  }

  @Get()
  findAll() {
    return this.tutorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorService.findOne(+id);
  }

  // Đổi từ Put thành Patch cho khớp với Frontend
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTutorDto: any) {
    return this.tutorService.update(+id, updateTutorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorService.remove(+id);
  }
}
