const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Thêm CSS hiệu ứng xoay icon
    const spinStyle = `
<style id="spin-style">
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.spin-icon { display: inline-block; animation: spin 0.6s ease-in-out; }
</style>`;

    if (!html.includes('spin-style')) {
        html = html.replace('</head>', `${spinStyle}\n</head>`);
    }

    // Hàm xử lý tải lại có hiệu ứng xoay icon 🔄
    const reloadScript = `
<script id="spin-reload-script">
function handleReloadClick(btn) {
    const icon = btn.querySelector('.icon-reload') || btn;
    icon.classList.add('spin-icon');
    
    setTimeout(() => {
        icon.classList.remove('spin-icon');
    }, 600);

    // Tự động tìm và gọi tất cả các hàm load dữ liệu có thể có
    if (typeof layDanhSachSinhVien === 'function') layDanhSachSinhVien(1);
    else if (typeof loadStudents === 'function') loadStudents();
    else if (typeof fetchStudents === 'function') fetchStudents();
    else if (typeof getStudents === 'function') getStudents();
    else if (typeof renderStudents === 'function') renderStudents();
}
</script>`;

    html = html.replace(/<script id="spin-reload-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${reloadScript}\n</body>`);

    // Gắn hàm vào nút Tải lại
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="handleReloadClick(this)"><span class="icon-reload">🔄</span> Tải lại</button>`
    );

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã gắn hiệu ứng xoay icon 🔄 cho nút Tải lại!');
}
