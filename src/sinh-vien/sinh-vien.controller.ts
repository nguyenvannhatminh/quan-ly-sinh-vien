import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { SinhVienService } from './sinh-vien.service';
import { STUDENT } from '../entities/student.entity';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) {}

  @Get()
  layDanhSach() {
    return this.sinhVienService.layDanhSach();
  }

  @Get(':sid')
  layChiTiet(@Param('sid') sid: string) {
    return this.sinhVienService.layChiTiet(sid);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  themMoi(@Body() duLieuMoi: STUDENT) {
    return this.sinhVienService.themMoi(duLieuMoi);
  }

  @Put(':sid')
  capNhat(@Param('sid') sid: string, @Body() duLieuCapNhat: Partial<STUDENT>) {
    return this.sinhVienService.capNhat(sid, duLieuCapNhat);
  }

  @Delete(':sid')
  xoa(@Param('sid') sid: string) {
    return this.sinhVienService.xoa(sid);
  }
}
