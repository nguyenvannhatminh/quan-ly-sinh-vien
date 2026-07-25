const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Dọn dẹp các đoạn code JS bị lộ ra văn bản HTML
    html = html.replace(/';\s*const blob[\s\S]*?napDuLieuBoLoc\(\);\s*}\);?/g, '');
    html = html.replace(/const blob[\s\S]*?napDuLieuBoLoc\(\);\s*}\);?/g, '');

    // 2. Xóa bỏ các kịch bản cũ bị chèn lỗi
    html = html.replace(/<script id="direct-patch">[\s\S]*?<\/script>/g, '');
    html = html.replace(/<!-- BỘ CỨU HỘ NÚT BẤM[\s\S]*?<\/script>/g, '');
    html = html.replace(/<script id="ultimate-fix">[\s\S]*?<\/script>/g, '');

    // 3. Tạo kịch bản chuẩn được bọc kín trong thẻ <script>
    const cleanScript = `
<script id="clean-script-fixed">
// --- HÀM SỬA SINH VIÊN ---
window.openEditModal = window.editStudent = function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    fetch('/sinh-vien/' + id)
        .then(res => {
            if (!res.ok) throw new Error('Không lấy được dữ liệu sinh viên!');
            return res.json();
        })
        .then(sv => {
            const editModal = document.getElementById('customEditModal') || document.getElementById('editModal');
            if (editModal) {
                const idInput = document.getElementById('editSvId') || document.getElementById('editSid');
                const nameInput = document.getElementById('editSvName') || document.getElementById('editName');
                const emailInput = document.getElementById('editSvEmail') || document.getElementById('editEmail');
                
                if (idInput) idInput.value = sv.SID || id;
                if (nameInput) nameInput.value = sv.name || '';
                if (emailInput) emailInput.value = sv.email || '';
                
                editModal.style.display = 'flex';
            } else {
                alert('Đã tải SV ' + (sv.name || id) + ' thành công! Cần kiểm tra ID của Modal Sửa.');
            }
        })
        .catch(err => alert(err.message));
};

// --- HÀM NHẬP ĐIỂM ---
window.openGradeModal = function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    const gradeModal = document.getElementById('customGradeModal') || document.getElementById('gradeModal');
    if (gradeModal) {
        const idInput = document.getElementById('gradeSvId');
        if (idInput) idInput.value = id;
        gradeModal.style.display = 'flex';
    } else {
        alert('Nhập điểm cho Mã SV: ' + id);
    }
};

// --- PHÂN TRANG KHÔNG LOAD LẠI TRANG ---
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a');
        if (!btn) return;

        const text = btn.innerText.trim();
        if (['1', '2', '3', '4', '5'].includes(text) || text.includes('Trước') || text.includes('Sau')) {
            let currentPage = window.currentPage || 1;
            let targetPage = currentPage;

            if (text.includes('Trước')) targetPage = Math.max(1, currentPage - 1);
            else if (text.includes('Sau')) targetPage = currentPage + 1;
            else if (!isNaN(parseInt(text))) targetPage = parseInt(text);

            if (typeof window.layDanhSachSinhVien === 'function') {
                window.currentPage = targetPage;
                window.layDanhSachSinhVien(targetPage);
            }
        }
    });
});
</script>
`;

    // Chèn lại vào ngay trước </body>
    html = html.replace('</body>', cleanScript + '\n</body>');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('🎉 Đã dọn sạch code JS tràn màn hình & khôi phục giao diện!');
} else {
    console.log('❌ Không tìm thấy file ./public/index.html');
}
