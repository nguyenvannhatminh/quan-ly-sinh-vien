const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Xóa sạch mọi thẻ script công cụ cũ đã chèn
    html = html.replace(/<script id=".*?"[\s\S]*?<\/script>/gi, '');

    // 2. Dọn sạch các chuỗi code JS bị rò rỉ ra HTML ngoài thẻ script
    html = html.replace(/eff'\s*\+\s*excelHTML[\s\S]*?(?=<\/body>|<\/html>|<script|$)/gi, '');
    html = html.replace(/a\.href\s*=\s*url[\s\S]*?(?=<\/body>|<\/html>|<script|$)/gi, '');
    html = html.replace(/URL\.revokeObjectURL\(url\);?\s*}`?/gi, '');

    // Nếu có đoạn văn bản thừa sau </html> thì cắt bỏ luôn
    if (html.includes('</html>')) {
        const parts = html.split('</html>');
        html = parts[0] + '</html>';
    }

    // 3. Đảm bảo có thư viện SheetJS (XLSX) trong <head>
    if (!html.includes('xlsx.full.min.js')) {
        html = html.replace('</head>', '  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>\n</head>');
    }

    // 4. Chuẩn hóa bộ 3 nút bấm chuẩn đẹp
    const buttonGroupHtml = `<button type="button" class="btn btn-primary" onclick="reloadSinhVienVisual()">🔄 Tải lại</button>
    <button type="button" class="btn btn-success" onclick="xuatExcelSinhVien()" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px;">📥 Xuất Excel</button>
    <button type="button" class="btn btn-warning" onclick="document.getElementById('excelFileInput').click()" style="background-color: #F59E0B; border-color: #F59E0B; color: #ffffff; margin-left: 8px; font-weight: 500;">📥 Nhập Excel</button>
    <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">`;

    if (html.match(/<button[^>]*>.*?Tải lại.*?<\/button>/gi)) {
        html = html.replace(/<button[^>]*>.*?Xuất Excel.*?<\/button>/gi, '');
        html = html.replace(/<button[^>]*>.*?Nhập Excel.*?<\/button>/gi, '');
        html = html.replace(/<input[^>]*id="excelFileInput"[^>]*>/gi, '');
        html = html.replace(/<button[^>]*>.*?Tải lại.*?<\/button>/gi, buttonGroupHtml);
    }

    // 5. Đóng gói duy nhất 1 thẻ <script> sạch sẽ chứa đủ 3 tính năng
    const masterScript = `
<script id="karl-system-tools">
// 1. TẢI LẠI DANH SÁCH
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
                } else if (typeof loadStudents === 'function') {
                    await loadStudents();
                } else {
                    location.reload();
                }
            } catch (err) {
                tbody.innerHTML = originalRows;
            }
        }, 300);
    } else {
        location.reload();
    }
}

// 2. XUẤT EXCEL
function xuatExcelSinhVien() {
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

// 3. NHẬP EXCEL HÀNG LOẠT
async function xuLyImportExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    if (typeof XLSX === 'undefined') {
        alert('⚠️ Thư viện XLSX đang tải, vui lòng bấm lại sau 2 giây!');
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            if (!jsonData || jsonData.length === 0) {
                alert('⚠️ File Excel trống!');
                return;
            }

            let successCount = 0;
            let failCount = 0;

            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            for (const row of jsonData) {
                const name = row['Họ và Tên'] || row['Họ tên'] || row['HỌ TÊN'] || row['HO TEN'] || row['Name'] || row['name'];
                const email = row['Email'] || row['EMAIL'] || row['email'];

                if (!name || !email) {
                    failCount++;
                    continue;
                }

                try {
                    const res = await fetch('/sinh-vien', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ name: String(name).trim(), email: String(email).trim() })
                    });
                    if (res.ok) successCount++;
                    else failCount++;
                } catch (err) {
                    failCount++;
                }
            }

            alert('🎉 Kết quả nhập Excel:\\n- Thành công: ' + successCount + ' sinh viên\\n- Lỗi / Bỏ qua: ' + failCount);
            reloadSinhVienVisual();

        } catch (error) {
            console.error(error);
            alert('❌ Có lỗi xảy ra khi đọc file Excel!');
        }
    };
    reader.readAsArrayBuffer(file);
}
</script>`;

    html = html.replace('</body>', masterScript + '\n</body>');
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã dọn sạch 100% rác chân trang & hoàn thiện cả 3 tính năng!');
}
