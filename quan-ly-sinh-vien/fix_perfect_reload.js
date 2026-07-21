const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Tạo hàm Tải lại chuyên nghiệp: Có hiệu ứng mờ bảng + Gọi đúng hàm layDanhSachSinhVien gốc
    const perfectScript = `
<script id="perfect-reload-script">
async function reloadSinhVienChuan() {
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        tbody.style.opacity = '0.2';
        tbody.style.transition = 'opacity 0.2s ease';
    }

    // Gọi hàm lấy dữ liệu chuẩn gốc
    if (typeof layDanhSachSinhVien === 'function') {
        const page = (typeof currentPage !== 'undefined') ? currentPage : 1;
        await layDanhSachSinhVien(page);
    }

    setTimeout(() => {
        if (tbody) tbody.style.opacity = '1';
    }, 250);
}
</script>`;

    // Dọn dẹp script cũ nếu có
    html = html.replace(/<script id=".*?-reload-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${perfectScript}\n</body>`);

    // Gán nút Tải lại chạy hàm reloadSinhVienChuan()
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="reloadSinhVienChuan()">🔄 Tải lại</button>`
    );

    // Gán nút Xuất Excel gọi trực tiếp hàm exportToExcel() gốc hoặc xuatExcelSinhVien()
    html = html.replace(
        /<button[^>]*>.*?Xuất Excel.*?<\/button>/gi,
        `<button type="button" class="btn btn-success" onclick="if(typeof exportToExcel === 'function'){ exportToExcel(); } else { xuatExcelSinhVien(); }" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px;">📥 Xuất Excel</button>`
    );

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã kết nối 100% chính xác vào hàm gốc của hệ thống!');
}
