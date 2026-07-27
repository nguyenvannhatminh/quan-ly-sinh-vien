import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cấu hình Validation toàn cục
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            
    forbidNonWhitelisted: true, 
    transform: true,            
  }));

  // Cấu hình giao diện Swagger Web UI
  const config = new DocumentBuilder()
    .setTitle('Hệ thống Quản lý Sinh viên')
    .setDescription('API tài liệu dành cho Sinh viên, Giảng viên và Môn học')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Trang web sẽ nằm ở đường dẫn /api

  await app.listen(3000);
}
bootstrap();
