const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// Định vị khối code gây xung đột
const startStr = '// --- HỒI SINH HỆ THỐNG AUTH ---';
const endStr = '// ---------------------------------';

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const cutEnd = endIndex + endStr.length;
    // Bứng hoàn toàn khối code đó ra khỏi file
    html = html.substring(0, startIndex) + html.substring(cutEnd);
    fs.writeFileSync('./public/index.html', html);
    console.log('🎉 BINGO! Đã bứng thành công khối code gây lỗi Vùng Chết (TDZ)!');
} else {
    console.log('⚠️ Không tìm thấy khối code cần xóa.');
}
