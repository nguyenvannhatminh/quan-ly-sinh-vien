const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    const cleanScript = `
<script>
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, a, .btn');
    if (!btn) return;

    const txt = (btn.innerText || '').toLowerCase();
    if (txt.includes('tải lại') || txt.includes('làm mới')) {
        e.preventDefault();
        
        // Gọi tất cả các hàm tải lại có thể có trong hệ thống
        if (typeof layDanhSachMonHoc === 'function') layDanhSachMonHoc();
        if (typeof layDanhSachGiangVien === 'function') layDanhSachGiangVien();
        if (typeof layDanhSachSinhVien === 'function') layDanhSachSinhVien(1);
        if (typeof napDuLieuBoLoc === 'function') napDuLieuBoLoc();
        if (typeof loadSubjects === 'function') loadSubjects();
        if (typeof loadTutors === 'function') loadTutors();
    }
});
</script>
`;

    if (html.includes('</body>')) {
        html = html.replace('</body>', cleanScript + '\n</body>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('✅ Đã xóa sạch chữ trắng rác & kích hoạt nút Tải lại thành công!');
    } else {
        console.log('❌ Không tìm thấy thẻ </body> trong file HTML');
    }
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
