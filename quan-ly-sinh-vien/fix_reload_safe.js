const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    const safeScript = `
<!-- SAFE RELOAD SCRIPT -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const text = (btn.innerText || '').toLowerCase();
        const icon = (btn.innerHTML || '').toLowerCase();
        
        if (text.includes('tải lại') || text.includes('làm mới') || icon.includes('refresh') || icon.includes('sync')) {
            // Quét xem nút này nằm trong khu vực (tab/div) nào
            const container = btn.closest('section, div.tab-pane, div.container-fluid');
            if (!container) return;
            
            const containerHtml = container.innerHTML.toLowerCase();
            
            // Xử lý tải lại Giảng viên
            if (containerHtml.includes('giảng viên') || containerHtml.includes('giáo viên')) {
                if (typeof layDanhSachGiangVien === 'function') {
                    e.preventDefault();
                    layDanhSachGiangVien();
                    console.log('Đã tải lại danh sách giảng viên!');
                }
            } 
            // Xử lý tải lại Môn học
            else if (containerHtml.includes('môn học')) {
                if (typeof layDanhSachMonHoc === 'function') {
                    e.preventDefault();
                    layDanhSachMonHoc();
                    console.log('Đã tải lại danh sách môn học!');
                }
            }
        }
    });
});
</script>
`;

    if (!html.includes('SAFE RELOAD SCRIPT')) {
        // Chèn vào ngay trước thẻ đóng body
        html = html.replace('</body>', safeScript + '\n</body>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('✅ Đã gắn tính năng Tải lại an toàn!');
    } else {
        console.log('ℹ️ Script tải lại đã có sẵn.');
    }
}
