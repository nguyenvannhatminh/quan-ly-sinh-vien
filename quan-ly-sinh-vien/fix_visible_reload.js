const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Tạo hàm Reload có hiện dòng "Đang tải..." rõ ràng
    const visualReloadScript = `
<script id="visual-reload-script">
async function reloadSinhVienVisual() {
    const tbody = document.querySelector('table tbody');
    
    if (tbody) {
        const originalRows = tbody.innerHTML;
        
        // 1. Hiện dòng thông báo đang tải để mắt thấy phản hồi lập tức
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px; color: #2563eb; font-weight: bold; font-size: 15px;">⏳ Đang tải lại danh sách sinh viên...</td></tr>';
        
        // 2. Tải lại dữ liệu sau 300ms
        setTimeout(async () => {
            try {
                if (typeof layDanhSachSinhVien === 'function') {
                    const page = (typeof currentPage !== 'undefined') ? currentPage : 1;
                    await layDanhSachSinhVien(page);
                } else {
                    tbody.innerHTML = originalRows;
                }
            } catch (err) {
                console.error(err);
                tbody.innerHTML = originalRows;
            }
        }, 300);
    }
}
</script>`;

    // Xóa script reload cũ và chèn script mới
    html = html.replace(/<script id=".*?-reload-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${visualReloadScript}\n</body>`);

    // Gán hàm vào nút Tải lại
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="reloadSinhVienVisual()">🔄 Tải lại</button>`
    );

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã cập nhật nút Tải lại có phản hồi "Đang tải..." siêu rõ ràng!');
}
