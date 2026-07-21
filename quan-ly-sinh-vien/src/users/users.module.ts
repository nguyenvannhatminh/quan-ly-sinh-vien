import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER } from '../entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([USER])],
  providers: [UsersService],
  exports: [UsersService], // Cực kỳ quan trọng: Export để tí nữa AuthModule gọi sang
})
export class UsersModule {}
