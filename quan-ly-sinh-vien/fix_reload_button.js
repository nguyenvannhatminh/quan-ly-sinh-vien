const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    // 1. Dò tìm tất cả tên hàm liên quan đến Môn học & Giảng viên có sẵn trong file
    const funcMatches = [...html.matchAll(/function\s+([a-zA-Z0-9_]+)\s*\(/g)].map(m => m[1]);
    const monHocFns = funcMatches.filter(f => /monhoc|subject/i.test(f));
    const giangVienFns = funcMatches.filter(f => /giangvien|tutor|teacher/i.test(f));

    // 2. Tạo kịch bản xử lý nút Tải lại trực tiếp
    const reloadFixScript = `
<!-- FIX NÚT TẢI LẠI TRỰC TIẾP -->
<script id="fix-reload-direct">
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a, .btn');
        if (!btn) return;

        const txt = (btn.innerText || '').trim().toLowerCase();
        if (txt.includes('tải lại') || txt.includes('làm mới')) {
            e.preventDefault();
            
            // Lấy danh sách hàm đã dò được từ HTML
            const monHocFns = ${JSON.stringify(monHocFns)}.concat(['layDanhSachMonHoc', 'loadSubjects', 'fetchSubjects', 'renderMonHoc']);
            const giangVienFns = ${JSON.stringify(giangVienFns)}.concat(['layDanhSachGiangVien', 'loadTutors', 'fetchTutors', 'renderGiangVien']);

            // Xác định trang hiện tại dựa vào văn bản hiển thị trên màn hình
            const pageText = document.body.innerText.toLowerCase();
            let called = false;

            // Nếu đang ở trang Môn học
            if (pageText.includes('danh mục môn học') || pageText.includes('quản lý môn học')) {
                for (let fn of monHocFns) {
                    if (typeof window[fn] === 'function') {
                        window[fn]();
                        called = true;
                        break;
                    }
                }
            } 
            // Nếu đang ở trang Giảng viên
            else if (pageText.includes('danh sách giảng viên') || pageText.includes('quản lý giảng viên')) {
                for (let fn of giangVienFns) {
                    if (typeof window[fn] === 'function') {
                        window[fn]();
                        called = true;
                        break;
                    }
                }
            }

            // Phòng trường hợp chung
            if (!called) {
                for (let fn of [...monHocFns, ...giangVienFns]) {
                    if (typeof window[fn] === 'function') {
                        window[fn]();
                        break;
                    }
                }
            }
        }
    });
});
</script>
`;

    // Xóa script cũ nếu có và chèn script mới
    html = html.replace(/<script id="fix-reload-direct">[\s\S]*?<\/script>/g, '');
    html = html.replace('</body>', reloadFixScript + '\n</body>');

    fs.writeFileSync(file, html, 'utf8');
    console.log('✅ Đã gắn keo 502 cho nút TẢI LẠI thành công!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
