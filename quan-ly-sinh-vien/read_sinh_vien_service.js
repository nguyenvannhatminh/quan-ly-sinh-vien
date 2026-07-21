const fs = require('fs');
const path = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(path)) {
    console.log("🔍 === NỘI DUNG FILE SINH-VIEN.SERVICE.TS ===");
    console.log(fs.readFileSync(path, 'utf8'));
    console.log("=============================================");
} else {
    console.log("❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts");
}
