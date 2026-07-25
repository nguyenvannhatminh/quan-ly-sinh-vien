const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // 1. Thêm NotFoundException vào import từ @nestjs/common
    if (!code.includes('NotFoundException')) {
        if (code.includes('@nestjs/common')) {
            code = code.replace(
                /import\s*\{([^}]+)\}\s*from\s*['"]@nestjs\/common['"]/,
                "import { $1, NotFoundException } from '@nestjs/common'"
            );
        } else {
            code = `import { NotFoundException } from '@nestjs/common';\n` + code;
        }
    }

    // 2. Chuyển relations mảng sang cú pháp Object cho TypeORM v0.3+
    code = code.replace(
        /relations:\s*\[\s*['"]subjects['"]\s*,\s*['"]tutor['"]\s*\]/g,
        "relations: { subjects: true, tutor: true } as any"
    );

    // 3. Sửa gán sv.tutorId thành sv.tutor tương thích với Entity SinhVien
    code = code.replace(
        /sv\.tutorId\s*=\s*updateDto\.tutorId\s*\?\s*Number\(updateDto\.tutorId\)\s*:\s*null;/g,
        "sv.tutor = updateDto.tutorId ? ({ TID: Number(updateDto.tutorId) } as any) : null;"
    );

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('🎉 Đã fix dứt điểm cả 3 lỗi TypeORM & Entity!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
