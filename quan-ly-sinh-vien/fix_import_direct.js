const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Nếu chưa có import NotFoundException thì nhét thẳng lên đầu file
    if (!code.includes('NotFoundException')) {
        code = `import { NotFoundException } from '@nestjs/common';\n` + code;
        fs.writeFileSync(servicePath, code, 'utf8');
        console.log('✅ Đã thêm import NotFoundException lên đầu file thành công!');
    } else {
        console.log('ℹ️ Đã có sẵn NotFoundException trong file.');
    }
} else {
    console.log('❌ Không tìm thấy file service');
}
