const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // 1. Sửa tutor.id -> tutor.TID
    code = code.replace(/tutor\.id/g, 'tutor.TID');

    // 2. Sửa subject.id hoặc subjects.id -> subjects.SubID
    code = code.replace(/subject\.id/g, 'subjects.SubID');
    code = code.replace(/subjects\.id/g, 'subjects.SubID');

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã cập nhật đúng tên cột TID và SubID cho TypeORM!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
