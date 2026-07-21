const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Quét sạch các đoạn mã JS bị rò rỉ ra ngoài chân trang
    html = html.replace(/eff'\s*\+\s*excelHTML[\s\S]*?URL\.revokeObjectURL\(url\);?\s*}/gi, '');
    html = html.replace(/<script id=".*?"[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script id="excel-script">[\s\S]*?<\/script>/gi, '');

    // 2. Chèn lại bộ script chuẩn 100%, bọc kín trong thẻ <script>
    const cleanScript = `
<script id="custom-tools-script">
// Hàm tải lại có hiệu ứng thông báo "Đang tải..."
async function reloadSinhVienVisual() {
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        const originalRows = tbody.innerHTML;
        tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; padding: 20px; color: #2563eb; font-weight: bold; font-size: 15px;">⏳ Đang tải lại danh sách sinh viên...</td></tr>';
        
        setTimeout(async () => {
            try {
                if (typeof layDanhSachSinhVien === 'function') {
                    const page = (typeof currentPage !== 'undefined') ? currentPage : 1;
                    await layDanhSachSinhVien(page);
                } else {
                    tbody.innerHTML = originalRows;
                }
            } catch (err) {
                tbody.innerHTML = originalRows;
            }
        }, 300);
    }
}

// Hàm xuất Excel an toàn không leak code
function xuatExcelSinhVien() {
    if (typeof exportToExcel === 'function') {
        exportToExcel();
        return;
    }
    const table = document.querySelector('table');
    if (!table) {
        alert('⚠️ Không tìm thấy bảng dữ liệu sinh viên!');
        return;
    }
    const cloneTable = table.cloneNode(true);
    const rows = cloneTable.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.children.length > 0) {
            row.children[row.children.length - 1].remove();
        }
    });
    const excelHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body>' + cloneTable.outerHTML + '</body></html>';
    const blob = new Blob(['\\ufeff' + excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Danh_Sach_Sinh_Vien_' + new Date().toISOString().slice(0,10) + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
</script>`;

    // 3. Đặt script ngay trước thẻ </body>
    html = html.replace('</body>', `${cleanScript}\n</body>`);

    // 4. Gắn đúng sự kiện cho 2 nút
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="reloadSinhVienVisual()">🔄 Tải lại</button>`
    );
    html = html.replace(
        /<button[^>]*>.*?Xuất Excel.*?<\/button>/gi,
        `<button type="button" class="btn btn-success" onclick="xuatExcelSinhVien()" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px;">📥 Xuất Excel</button>`
    );

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã dọn sạch dải chữ bị rò rỉ ở chân trang!');
}
