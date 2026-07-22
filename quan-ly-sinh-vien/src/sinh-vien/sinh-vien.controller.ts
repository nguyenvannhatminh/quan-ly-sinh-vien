import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SinhVienService } from './sinh-vien.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('tutorId') tutorId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.sinhVienService.findAll(+page, +limit, search, tutorId, subjectId);
  }

  @Post()
  @Roles(Role.ADMIN, Role.GIAOVU)
  create(@Body() body: any) {
    return this.sinhVienService.create(body);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GIAOVU)
  update(@Param('id') id: string, @Body() body: any) {
    return this.sinhVienService.update(+id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GIAOVU)
  remove(@Param('id') id: string) {
    return this.sinhVienService.remove(+id);
  }
}
