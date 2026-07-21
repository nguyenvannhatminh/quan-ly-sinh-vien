const fs = require('fs');
const path = './public/index.html';

if (fs.existsSync(path)) {
    let html = fs.readFileSync(path, 'utf8');

    // Mẫu style cũ của ô input
    const oldStyle = 'style="width:100%; padding:0.55rem 0.75rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.95rem; box-sizing:border-box;"';
    
    // Mẫu style mới: Ép quyền tương tác cao nhất + Thêm chặn sự kiện rác
    const newStyle = 'style="position:relative; z-index:100000; pointer-events:auto !important; user-select:text !important; cursor:text !important; background-color:#ffffff !important; width:100%; padding:0.55rem 0.75rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.95rem; box-sizing:border-box;" onmousedown="event.stopPropagation()" onclick="event.stopPropagation()"';

    // Thay thế toàn bộ
    if (html.includes(oldStyle)) {
        html = html.split(oldStyle).join(newStyle);
        fs.writeFileSync(path, html);
        console.log('✅ Đã cấp quyền "Miễn trừ xung đột" cho ô nhập điểm!');
    } else {
        console.log('⚠️ Không tìm thấy mẫu CSS cũ, có thể bro đã sửa gì đó rồi.');
    }
} else {
    console.log('❌ Không tìm thấy file index.html');
}
