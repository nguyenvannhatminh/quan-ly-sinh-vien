import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from '../common/decorators/cookies.decorator'; 

@Controller('sinh-vien')
export class SinhVienController {

  @Get('set')
  setCookie(@Res({ passthrough: true }) response: Response) {
    // Đặt cookie với tên 'ma_sv' và giá trị là mã số của bạn
    response.cookie('ma_sv', '24100084', { httpOnly: true });
    return { message: 'Đã ghi mã sinh viên vào Cookie thành công!' };
  }

  @Get('get')
  getCookie(@Cookies('ma_sv') mssv: string) {
    return {
      message: 'Đọc dữ liệu từ Cookie thành công!',
      cookie_nhan_duoc: mssv || 'Không tìm thấy cookie ma_sv'
    };
  }
}