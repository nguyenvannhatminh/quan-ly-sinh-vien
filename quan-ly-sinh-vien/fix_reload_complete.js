const fs = require('fs');
const filePath = './public/index.html';

let htmlContent = fs.readFileSync(filePath, 'utf8');

// Hàm reload hoàn chỉnh làm sạch cả Form + Filter + Table
const cleanReloadFunction = `
        async function reloadSinhVienVisual() {
            try {
                // 1. Xóa sạch Form nhập liệu
                const tenSV = document.getElementById('tenSV');
                const emailSV = document.getElementById('emailSV');
                const tutorSelect = document.getElementById('tutorSelect');
                if (tenSV) tenSV.value = '';
                if (emailSV) emailSV.value = '';
                if (tutorSelect) tutorSelect.value = '';

                document.querySelectorAll('input[name="monhoc"]').forEach(cb => cb.checked = false);

                // 2. Xóa sạch Bộ lọc & Ô tìm kiếm
                const tk = document.getElementById('timKiemInput');
                const ft = document.getElementById('filterTutor');
                const fs = document.getElementById('filterSubject');
                if (tk) tk.value = '';
                if (ft) ft.value = '';
                if (fs) fs.value = '';

                // 3. Reset các ô chọn Checkbox chọn tất cả & Nút xóa hàng loạt
                const selectAll = document.getElementById('selectAll');
                if (selectAll) selectAll.checked = false;

                const btnXoa = document.getElementById('btnXoaHangLoat');
                if (btnXoa) btnXoa.style.display = 'none';

                // 4. Load lại dữ liệu từ Server
                if (typeof napDuLieuBoLoc === 'function') await napDuLieuBoLoc();
                if (typeof layDanhSachSinhVien === 'function') await layDanhSachSinhVien(1);

            } catch(e) {
                console.error("Lỗi khi tải lại:", e);
                window.location.reload();
            }
        }
`;

// Thay thế hàm reloadSinhVienVisual cũ bằng hàm mới
const regex = /async function reloadSinhVienVisual\(\) \{[\s\S]*?\n        \}/;

if (regex.test(htmlContent)) {
    htmlContent = htmlContent.replace(regex, cleanReloadFunction.trim());
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log('🎉 Đã cập nhật nút Tải lại (Reset toàn bộ Form & Filter) thành công!');
} else {
    console.log('⚠️ Không tìm thấy hàm cũ, hãy đảm bảo file public/index.html đã tồn tại.');
}
