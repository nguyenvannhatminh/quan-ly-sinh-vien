import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SinhVienService } from './sinh-vien.service';
import { AuthGuard } from '../auth/auth.guard';

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
  @UseGuards(AuthGuard)
  create(@Body() body: any) {
    return this.sinhVienService.create(body);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() body: any) {
    return this.sinhVienService.update(+id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.sinhVienService.remove(+id);
  }
}
