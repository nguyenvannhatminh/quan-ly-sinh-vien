const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Nhúng thư viện đọc Excel XLSX từ CDN
    if (!html.includes('xlsx.full.min.js')) {
        html = html.replace('</head>', '    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>\n</head>');
    }

    // 2. Thêm input ẩn để chọn file Excel
    if (!html.includes('id="excelFileInput"')) {
        html = html.replace('</body>', '    <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">\n</body>');
    }

    // 3. Thêm nút [📥 Nhập Excel] cạnh nút [Xuất Excel]
    const importBtnHtml = `<button type="button" class="btn btn-warning" onclick="document.getElementById('excelFileInput').click()" style="background-color: #F59E0B; border-color: #F59E0B; color: #ffffff; margin-left: 8px; font-weight: 500;">📥 Nhập Excel</button>`;
    
    if (!html.includes('document.getElementById(\'excelFileInput\').click()')) {
        html = html.replace(/(<button[^>]*>.*?Xuất Excel.*?<\/button>)/gi, `$1\n    ${importBtnHtml}`);
    }

    // 4. Script xử lý đọc file Excel và gửi API
    const importScript = `
<script id="excel-import-script">
async function xuLyImportExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Reset value để có thể chọn lại cùng 1 file nếu cần
    event.target.value = '';

    if (typeof XLSX === 'undefined') {
        alert('⚠️ Thư viện đọc Excel chưa sẵn sàng, vui lòng bấm Ctrl + F5 để tải lại trang!');
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
                alert('⚠️ File Excel trống hoặc không đúng định dạng!');
                return;
            }

            let successCount = 0;
            let failCount = 0;

            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = \`Bearer \${token}\`;

            // Vòng lặp gửi dữ liệu từng sinh viên vào API
            for (const row of jsonData) {
                // Nhận diện linh hoạt các tên cột tiếng Việt & tiếng Anh phổ biến
                const name = row['Họ và Tên'] || row['Họ tên'] || row['HỌ TÊN'] || row['Họ Và Tên'] || row['HO TEN'] || row['Name'] || row['name'];
                const email = row['Email'] || row['EMAIL'] || row['email'];

                if (!name || !email) {
                    failCount++;
                    continue;
                }

                try {
                    const res = await fetch('/sinh-vien', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ 
                            name: String(name).trim(), 
                            email: String(email).trim() 
                        })
                    });

                    if (res.ok) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch (err) {
                    failCount++;
                }
            }

            alert(\`🎉 Tải dữ liệu thành công!\\n- Đã thêm thành công: \${successCount} sinh viên\\n- Lỗi / Bỏ qua: \${failCount}\`);

            // Làm mới lại bảng dữ liệu
            if (typeof reloadSinhVienVisual === 'function') {
                reloadSinhVienVisual();
            } else if (typeof layDanhSachSinhVien === 'function') {
                layDanhSachSinhVien(1);
            }

        } catch (error) {
            console.error(error);
            alert('❌ Có lỗi xảy ra khi đọc file Excel! Hãy chắc chắn file đúng chuẩn .xlsx hoặc .xls');
        }
    };

    reader.readAsArrayBuffer(file);
}
</script>`;

    // Làm sạch script cũ và chèn script mới
    html = html.replace(/<script id="excel-import-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${importScript}\n</body>`);

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã tích hợp nút [📥 Nhập Excel] và bộ đọc file thành công!');
}
