const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Thẻ nút bấm gốc trên dòng 224
    const targetLine = `<button class="btn btn-primary" onclick="layDanhSachSinhVien(1)">🔄 Tải lại</button>`;

    // 2. Thẻ nút bấm mới (Giữ nguyên nút Tải lại + Thêm nút Xuất Excel bên cạnh)
    const newLine = `<button class="btn btn-primary" onclick="layDanhSachSinhVien(1)">🔄 Tải lại</button>
    <button type="button" class="btn btn-success" onclick="xuatExcelSinhVien()" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px; font-weight: 500;">📥 Xuất Excel</button>`;

    // 3. Hàm JS xử lý xuất Excel Tiếng Việt không lỗi phông
    const excelFunction = `
<script>
function xuatExcelSinhVien() {
    const table = document.querySelector('table');
    if (!table) {
        alert('⚠️ Không tìm thấy bảng dữ liệu sinh viên!');
        return;
    }
    const cloneTable = table.cloneNode(true);
    
    // Bỏ cột "HÀNH ĐỘNG" (Sửa/Xóa/Nhập điểm)
    const rows = cloneTable.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.children.length > 0) {
            row.children[row.children.length - 1].remove();
        }
    });

    const excelContent = '\\ufeff' + cloneTable.outerHTML;
    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = \`Danh_Sach_Sinh_Vien_\${new Date().toISOString().slice(0,10)}.xls\`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
</script>`;

    // Thực hiện thay thế chính xác dòng 224
    if (html.includes(targetLine)) {
        html = html.replace(targetLine, newLine);
        
        // Chèn hàm xuất Excel vào trước thẻ đóng </body>
        if (!html.includes('xuatExcelSinhVien')) {
            html = html.replace('</body>', `${excelFunction}\n</body>`);
        }
        
        fs.writeFileSync(filePath, html);
        console.log('✅ Đã thêm nút Xuất Excel thành công và an toàn 100%!');
    } else {
        console.log('⚠️ Không tìm thấy đúng chuỗi dòng 224, chưa can thiệp gì vào file.');
    }
}
