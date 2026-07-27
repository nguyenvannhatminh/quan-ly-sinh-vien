#!/bin/bash

# 1. Ép buộc diệt tận gốc bất kỳ tiến trình nào đang chiếm cổng 9999
kill -9 $(lsof -t -i:9999) 2>/dev/null
fuser -k 9999/tcp 2>/dev/null
pkill -9 -f ts-node 2>/dev/null
pkill -9 -f node 2>/dev/null

# 2. Xóa file database lỗi để TypeORM tự tạo lại file mới tinh
rm -f sinhvien.db server.log

# 3. Ghi đè phiên bản code CHUẨN (Xóa hoàn toàn chữ 'mat_khau_goc_test')
cat << 'EOF' > src/sinh-vien/sinh-vien.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaiKhoanEntity } from './tai-khoan.entity';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(
    @InjectRepository(TaiKhoanEntity)
    private taiKhoanRepository: Repository<TaiKhoanEntity>,
  ) {}

  @Post('dang-ky')
  async dangKy(@Body() body: Record<string, any>) {
    const { username, password } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const taiKhoanMoi = this.taiKhoanRepository.create({ username, password_hash: hashedPassword });
    await this.taiKhoanRepository.save(taiKhoanMoi);
    return { message: 'DA_LUU_CSDL_THANH_CONG', data: taiKhoanMoi };
  }
}
EOF

cat << 'EOF' > src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SinhVienController } from './sinh-vien/sinh-vien.controller';
import { TaiKhoanEntity } from './tai-khoan.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sinhvien.db',
      entities: [TaiKhoanEntity],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaiKhoanEntity]),
  ],
  controllers: [SinhVienController],
})
export class AppModule {}
EOF

cat << 'EOF' > src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(9999);
}
bootstrap();
EOF

# 4. Khởi động server mới và đẩy log ra file theo dõi
npx ts-node src/main.ts > server.log 2>&1 &
echo "⏳ Đang kích hoạt server chuẩn CSDL... Chờ 8 giây..."
sleep 8

# 5. Bắn dữ liệu Test vào cổng 9999 mới
echo -e "\n=== PHẢN HỒI TỪ SERVER MỚI ==="
curl -s -X POST http://localhost:9999/sinh-vien/dang-ky \
-H "Content-Type: application/json" \
-d '{"username":"24100084", "password":"MatKhauSieuCapVipPro123"}'

# 6. Kiểm tra bảng dữ liệu trong SQLite
echo -e "\n\n=== DỮ LIỆU TRONG CSDL ==="
if [ -f "sinhvien.db" ]; then
  sqlite3 sinhvien.db -header -column "SELECT * FROM TaiKhoan;"
else
  echo "LỖI: Server không thể tạo được file CSDL! Hãy xem log bên dưới:"
  cat server.log
fi