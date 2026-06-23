import { Controller, Get, Res, Session } from '@nestjs/common';
import { Response } from 'express';

@Controller('sinh-vien')
export class SinhVienController {
  
  @Get('set')
  setCookie(@Res({ passthrough: true }) response: Response) {
    response.cookie('ma_sinh_vien', '24100084');
    return { message: 'Đã ghi mã sinh viên vào Cookie thành công!' };
  }

  @Get('get')
  getCookie() {
    return { message: 'Đọc Cookie thành công!' };
  }

  @Get('session-test')
  testSession(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    session.ma_sv = '24100084';

    return { 
      message: 'Cài đặt Session thành công!',
      thong_tin_luu_tru: {
        sinh_vien: session.ma_sv,
        so_lan_ban_da_tai_trang_nay: session.visits
      }
    };
  }
}
