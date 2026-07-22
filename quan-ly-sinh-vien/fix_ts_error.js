const fs = require('fs');
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';

if (fs.existsSync(controllerPath)) {
    let code = fs.readFileSync(controllerPath, 'utf8');
    
    // Bỏ dấu '+' trước tutorId và subjectId để truyền dạng string
    code = code.replace(/\+tutorId/g, 'tutorId');
    code = code.replace(/\+subjectId/g, 'subjectId');

    fs.writeFileSync(controllerPath, code, 'utf8');
    console.log('✅ Đã sửa lỗi Type Mismatch trong sinh-vien.controller.ts!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.controller.ts');
}
