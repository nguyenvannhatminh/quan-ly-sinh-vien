const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Tự động tìm và chèn nút "Nhập điểm" vào hàm render danh sách Sinh viên
    const oldActionPattern = /(`|\$)\s*<button[^>]*onclick=["'](?:editSinhVien|editSv|openEditModal)\(([^)]+)\)["'][^>]*>.*?<\/button>/g;
    
    // Nếu trong code frontend có hàm load/render danh sách sinh viên
    if (html.includes('openGradeModal')) {
        // Bổ sung nút bấm vào danh sách render nếu chưa có
        if (!html.includes('openGradeModal(')) {
            html = html.replace(/(<button[^>]*onclick=["']edit[^(]*\(([^)]+)\)["'][^>]*>[^<]*<\/button>)/gi, 
                `$1 <button onclick="openGradeModal($2)" style="background:#0EA5E9; color:white; border:none; padding:4px 10px; border-radius:6px; cursor:pointer; font-size:0.8rem; font-weight:600; margin-left:4px;">📝 Nhập điểm</button>`
            );
        }
    }

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã đính kèm nút [📝 Nhập điểm] vào giao diện Quản lý Sinh viên!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
