const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Tìm nút "Sửa" của Giảng viên/Môn học và xóa nút "Nhập điểm" đi kèm phía sau
    const fixRegex = /(<button[^>]*onclick=["'][^"']*(?:tutor|subject|mon|giang|mh|gv|teacher)[^"']*["'][^>]*>.*?Sửa.*?<\/button>)\s*<button[^>]*onclick=["']openGradeModal[^>]*>.*?📝 Nhập điểm.*?<\/button>/gi;
    
    html = html.replace(fixRegex, '$1');
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã dọn sạch các nút Nhập điểm đi lạc ở Giảng viên và Môn học!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
