const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    const safeScript = `
    <!-- BỘ XỬ LÝ NÚT TẢI LẠI AN TOÀN -->
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            
            const text = (btn.innerText || '').toLowerCase();
            const icon = (btn.innerHTML || '').toLowerCase();
            
            if (text.includes('tải lại') || text.includes('làm mới') || icon.includes('refresh') || icon.includes('sync')) {
                const container = btn.closest('section, div.tab-pane, div.container-fluid');
                if (!container) return;
                
                const containerHtml = container.innerHTML.toLowerCase();
                
                if (containerHtml.includes('giảng viên') || containerHtml.includes('giáo viên')) {
                    if (typeof layDanhSachGiangVien === 'function') {
                        e.preventDefault();
                        layDanhSachGiangVien();
                    }
                } else if (containerHtml.includes('môn học')) {
                    if (typeof layDanhSachMonHoc === 'function') {
                        e.preventDefault();
                        layDanhSachMonHoc();
                    }
                }
            }
        });
    });
    </script>
`;

    // Kiểm tra xem đã có script này chưa để tránh chèn trùng lặp
    if (!html.includes('BỘ XỬ LÝ NÚT TẢI LẠI AN TOÀN')) {
        // Tìm thẻ </body> ở cuối file để chèn vào ngay phía trước nó
        html = html.replace(/<\/body>\s*<\/html>\s*$/i, safeScript + '\n</body>\n</html>');
        fs.writeFileSync(file, html, 'utf8');
        console.log('✅ Đã chèn Bộ xử lý nút TẢI LẠI thành công tuyệt đối!');
    } else {
        console.log('⚠️ Tính năng này đã được chèn vào trước đó rồi, không cần chèn thêm!');
    }
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
