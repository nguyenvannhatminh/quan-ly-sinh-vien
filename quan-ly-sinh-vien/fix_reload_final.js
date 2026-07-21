const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Dọn dẹp các script gán event động thừa từ đợt trước
    html = html.replace(/<script id="button-handler">[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script id="excel-script">[\s\S]*?<\/script>/gi, '');

    // 2. Chuẩn hóa nút Tải lại: Gọi layDanhSachSinhVien(1), nếu lỗi thì tự reload trang
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="if(typeof layDanhSachSinhVien === 'function'){ layDanhSachSinhVien(1); } else { location.reload(); }">🔄 Tải lại</button>`
    );

    // 3. Chuẩn hóa nút Xuất Excel: Gọi hàm xuatExcelSinhVien()
    html = html.replace(
        /<button[^>]*>.*?Xuất Excel.*?<\/button>/gi,
        `<button type="button" class="btn btn-success" onclick="xuatExcelSinhVien()" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px;">📥 Xuất Excel</button>`
    );

    // 4. Hàm xuất Excel độc lập
    const excelScript = `
<script id="excel-script">
function xuatExcelSinhVien() {
    const table = document.querySelector('table');
    if (!table) {
        alert('⚠️ Không tìm thấy bảng dữ liệu sinh viên!');
        return;
    }

    const cloneTable = table.cloneNode(true);
    
    // Loại bỏ cột HÀNH ĐỘNG cuối cùng
    const rows = cloneTable.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.children.length > 0) {
            row.children[row.children.length - 1].remove();
        }
    });

    const excelHTML = \`
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8" /></head>
        <body>\${cloneTable.outerHTML}</body>
        </html>
    \`;

    const blob = new Blob(['\\ufeff' + excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`Danh_Sach_Sinh_Vien_\${new Date().toISOString().slice(0,10)}.xls\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>`;

    html = html.replace('</body>', `${excelScript}\n</body>`);

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã khôi phục và sửa dứt điểm cả 2 nút!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
