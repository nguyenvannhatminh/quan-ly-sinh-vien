import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SinhVienService } from './sinh-vien.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string = ''
  ) {
    return this.sinhVienService.findAll(+page, +limit, search);
  }

  @Post()
  // @UseGuards() -> Đã tạm tắt để test CRUD
  @Roles(Role.ADMIN, Role.GIAOVU)
  create(@Body() body: any) {
    return this.sinhVienService.create(body);
  }

  @Patch(':id')
  // @UseGuards() -> Đã tạm tắt để test CRUD
  @Roles(Role.ADMIN, Role.GIAOVU)
  update(@Param('id') id: string, @Body() body: any) {
    return this.sinhVienService.update(+id, body);
  }

  @Delete(':id')
  // @UseGuards() -> Đã tạm tắt để test CRUD
  @Roles(Role.ADMIN, Role.GIAOVU)
  remove(@Param('id') id: string) {
    return this.sinhVienService.remove(+id);
  }
}
