import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SinhVienService } from './sinh-vien.service';
import { SinhVienController } from './sinh-vien.controller';
import { SinhVien } from './entities/sinh-vien.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Subject } from '../subject/entities/subject.entity';

@Module({
  imports: [
    // Đăng ký Entity cho Database
    TypeOrmModule.forFeature([SinhVien, Tutor, Subject]),
    
    // Đăng ký JwtModule để AuthGuard có thể xài được JwtService
    JwtModule.register({
      secret: 'karl-secret-key', // Secret key tạm thời
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [SinhVienController],
  providers: [SinhVienService],
})
export class SinhVienModule {}
