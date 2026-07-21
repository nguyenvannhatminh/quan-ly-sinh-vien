const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Quét tìm chính xác nút có chữ "Sửa", trích xuất tham số ID bên trong sự kiện onclick
    const editBtnRegex = /(<button[^>]*onclick=["'][^"']*?\(([^)]+)\)["'][^>]*>.*?Sửa.*?<\/button>)/gi;

    if (!html.includes('📝 Nhập điểm')) {
        html = html.replace(editBtnRegex, `$1 <button onclick="openGradeModal($2)" style="background:#0EA5E9; color:white; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:600; margin-left:4px;">📝 Nhập điểm</button>`);
        fs.writeFileSync(filePath, html);
        console.log('✅ Đã ÉP DÍNH nút [📝 Nhập điểm] vào cạnh nút Sửa thành công!');
    } else {
        console.log('⚠️ Code nút Nhập điểm đã có sẵn trong file rồi, bro thử xóa Cache trình duyệt nhé!');
    }
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
