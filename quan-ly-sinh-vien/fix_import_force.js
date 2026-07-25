const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Kiểm tra xem ĐÃ IMPORT thực sự chưa (chứ không kiểm tra câu lệnh throw)
    const hasImport = /import\s*\{[^}]*NotFoundException[^}]*\}\s*from\s*['"]@nestjs\/common['"]/.test(code);

    if (!hasImport) {
        // Ép chèn import ngay dòng đầu tiên
        code = `import { NotFoundException } from '@nestjs/common';\n` + code;
        fs.writeFileSync(servicePath, code, 'utf8');
        console.log('✅ Đã ép chèn import NotFoundException thành công!');
    } else {
        console.log('ℹ️ Đã có import NotFoundException.');
    }
}
