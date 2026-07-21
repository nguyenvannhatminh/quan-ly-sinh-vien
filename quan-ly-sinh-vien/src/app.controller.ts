import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/login')
  login(@Body() body: any) { return this.appService.login(body.username); }
  @Post('auth/register')
  register() { return { message: 'Đăng ký thành công' }; }

  // --- API Giảng viên ---
  @Get('tutor')
  getTutors() { return this.appService.getTutors(); }
  @Post('tutor')
  addTutor(@Body() body: any) { return this.appService.addTutor(body.name); }
  @Delete('tutor/:id')
  deleteTutor(@Param('id') id: string) { return this.appService.deleteTutor(+id); }

  // --- API Môn học ---
  @Get('subject')
  getSubjects() { return this.appService.getSubjects(); }
  @Post('subject')
  addSubject(@Body() body: any) { return this.appService.addSubject(body.name); }
  @Delete('subject/:id')
  deleteSubject(@Param('id') id: string) { return this.appService.deleteSubject(+id); }

  // --- API Sinh viên ---
  @Get('sinh-vien')
  getSinhViens(@Query('page') page: number, @Query('limit') limit: number, @Query('search') search: string) {
    return this.appService.getSinhViens(page || 1, limit || 5, search);
  }
  @Post('sinh-vien')
  addSinhVien(@Body() body: any) { return this.appService.addSinhVien(body); }
  @Patch('sinh-vien/:id')
  updateSinhVien(@Param('id') id: string, @Body() body: any) { return this.appService.updateSinhVien(+id, body); }
  @Delete('sinh-vien/:id')
  deleteSinhVien(@Param('id') id: string) { return this.appService.deleteSinhVien(+id); }
}
