const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Dọn dẹp các script gắn nút cũ nếu có
    html = html.replace(/<script id="button-handler">[\s\S]*?<\/script>/gi, '');

    const scriptAction = `
<script id="button-handler">
(function initButtonListeners() {
    function exportToExcel() {
        const table = document.querySelector('table');
        if (!table) {
            alert('⚠️ Không tìm thấy bảng dữ liệu sinh viên!');
            return;
        }

        const cloneTable = table.cloneNode(true);
        
        // Loại bỏ cột "HÀNH ĐỘNG" (Sửa / Nhập điểm / Xóa)
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

    function bindEvents() {
        document.querySelectorAll('button').forEach(btn => {
            const text = btn.innerText || btn.textContent;

            // 1. Kích hoạt nút Tải lại
            if (text.includes('Tải lại') && !btn.dataset.bound) {
                btn.dataset.bound = 'true';
                btn.onclick = function(e) {
                    e.preventDefault();
                    if (typeof window.layDanhSachSinhVien === 'function') {
                        try { window.layDanhSachSinhVien(1); return; } catch(err){}
                    }
                    if (typeof window.loadStudents === 'function') {
                        try { window.loadStudents(); return; } catch(err){}
                    }
                    window.location.reload();
                };
            }

            // 2. Kích hoạt nút Xuất Excel
            if (text.includes('Xuất Excel') && !btn.dataset.bound) {
                btn.dataset.bound = 'true';
                btn.onclick = function(e) {
                    e.preventDefault();
                    exportToExcel();
                };
            }
        });
    }

    // Chạy bind ngay khi DOM tải xong & duy trì lắng nghe
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bindEvents);
    } else {
        bindEvents();
    }
    setInterval(bindEvents, 500);
})();
</script>`;

    html = html.replace('</body>', `${scriptAction}\n</body>`);
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã kích hoạt sự kiện cho cả 2 nút Tải lại & Xuất Excel!');
}
