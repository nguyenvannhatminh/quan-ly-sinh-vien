import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session'; // <--- Import theo tài liệu

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  
  // <--- Cấu hình Session giống hệt tài liệu
  app.use(
    session({
      secret: 'my-secret', 
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  await app.listen(3000);
  console.log('=== SERVER NESTJS ĐÃ CHẠY TẠI http://localhost:3000 ===');
}
bootstrap();
