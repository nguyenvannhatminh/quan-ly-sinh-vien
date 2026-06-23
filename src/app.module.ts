import { Module } from '@nestjs/common';
import { SinhVienController } from './sinh-vien/sinh-vien.controller';

@Module({
  imports: [],
  controllers: [SinhVienController],
  providers: [],
})
export class AppModule {}
