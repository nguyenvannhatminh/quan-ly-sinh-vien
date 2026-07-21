const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Ép nút "Tải lại" chạy lệnh window.location.reload() của trình duyệt
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="window.location.reload();">🔄 Tải lại</button>`
    );

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã ép nút Tải lại thành công! Nút sẽ luôn F5 lại trang.');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
