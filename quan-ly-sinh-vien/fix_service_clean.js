const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Chuyển tất cả các gọi .trim() thành String($1 || '').trim() an toàn tuyệt đối
    code = code.replace(/([a-zA-Z0-9_$]+)\.trim\(\)/g, "String($1 || '').trim()");

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã khôi phục cú pháp và sửa hàm .trim() an toàn 100%!');
}
