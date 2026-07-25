const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    const reloadScript = `
<!-- BỘ XỬ LÝ NÚT TẢI LẠI -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const text = btn.innerText.trim().toLowerCase();
        const icon = btn.innerHTML.toLowerCase();
        
        // Nhận diện nút Tải lại / Làm mới
        if (text.includes('tải lại') || text.includes('làm mới') || icon.includes('refresh') || icon.includes('sync')) {
            const container = btn.closest('.tab-pane, section, div.container, div');
            if (!container) return;
            
            const containerText = container.innerText.toLowerCase();
            
            // 1. Nếu nằm trong khu vực Giảng viên
            if (containerText.includes('giảng viên') || containerText.includes('giáo viên')) {
                e.preventDefault();
                if (typeof layDanhSachGiangVien === 'function') {
                    layDanhSachGiangVien();
                } else if (typeof window.loadTutors === 'function') {
                    window.loadTutors();
                } else {
                    alert('Chưa có hàm tải danh sách Giảng viên trong bản gốc này!');
                }
            } 
            // 2. Nếu nằm trong khu vực Môn học
            else if (containerText.includes('môn học')) {
                e.preventDefault();
                if (typeof layDanhSachMonHoc === 'function') {
                    layDanhSachMonHoc();
                } else if (typeof window.loadSubjects === 'function') {
                    window.loadSubjects();
                } else {
                    alert('Chưa có hàm tải danh sách Môn học trong bản gốc này!');
                }
            }
        }
    });
});
</script>
`;

    // Xóa script cũ nếu lỡ chạy nhiều lần
    html = html.replace(/<!-- BỘ XỬ LÝ NÚT TẢI LẠI[\s\S]*?<\/script>/g, '');
    
    // Gắn vào cuối body
    if (html.includes('</body>')) {
        html = html.replace('</body>', reloadScript + '\n</body>');
    } else {
        html += reloadScript;
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅ Đã gắn thành công bộ xử lý cho các nút Tải lại!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
