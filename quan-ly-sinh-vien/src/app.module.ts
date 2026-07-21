import { DashboardModule } from './dashboard/dashboard.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { SinhVienModule } from './sinh-vien/sinh-vien.module';
import { STUDENT } from './entities/student.entity';
import { TUTOR } from './entities/tutor.entity';
import { SUBJECT } from './entities/subject.entity';
import { USER } from './entities/user.entity';

import { TutorModule } from './tutor/tutor.module';
import { SubjectModule } from './subject/subject.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DashboardModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'quan_ly_sinh_vien',
      entities: [STUDENT, TUTOR, SUBJECT, USER],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    SinhVienModule,
    TutorModule,
    SubjectModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
