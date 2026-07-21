import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'ANH_EM_FULLSTACK_CHINH_PHUC_NESTJS_2026', // Chuỗi mã hóa bí mật bảo mật hệ thống
      signOptions: { expiresIn: '1h' }, // Token có hiệu lực trong 1 giờ
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
