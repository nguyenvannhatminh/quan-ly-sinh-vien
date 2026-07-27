import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LopHocService } from './lop-hoc.service';
import { CreateLopHocDto } from './dto/create-lop-hoc.dto';
import { UpdateLopHocDto } from './dto/update-lop-hoc.dto';

@Controller('lop-hoc')
export class LopHocController {
  constructor(private readonly lopHocService: LopHocService) {}

  @Post()
  create(@Body() createLopHocDto: CreateLopHocDto) {
    return this.lopHocService.create(createLopHocDto);
  }

  @Get()
  findAll() {
    return this.lopHocService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lopHocService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLopHocDto: UpdateLopHocDto) {
    return this.lopHocService.update(id, updateLopHocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lopHocService.remove(id);
  }
}
