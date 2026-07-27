import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVienModule } from './sinh-vien/sinh-vien.module';
import { STUDENT } from './entities/student.entity';
import { TUTOR } from './entities/tutor.entity';
import { TutorModule } from './tutor/tutor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'quan_ly_sinh_vien',
      entities: [STUDENT, TUTOR],
      synchronize: true,
    }),
    SinhVienModule,
    TutorModule,
  ],
})
export class AppModule {}
