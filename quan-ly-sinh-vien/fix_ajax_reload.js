const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Script làm mới riêng bảng Sinh viên + Tạo hiệu ứng chớp nhẹ
    const ajaxScript = `
<script id="ajax-reload-script">
function reloadStudentTableOnly() {
    const table = document.querySelector('table');
    if (table) {
        // Tạo hiệu ứng mờ nhẹ bảng để nhận biết đang làm mới dữ liệu
        table.style.opacity = '0.3';
        table.style.transition = 'opacity 0.2s ease';
    }

    // Gọi hàm lấy danh sách sinh viên chuẩn của hệ thống
    if (typeof layDanhSachSinhVien === 'function') {
        layDanhSachSinhVien(1);
    } else if (typeof loadSinhVienList === 'function') {
        loadSinhVienList(1);
    }

    // Khôi phục lại độ rõ của bảng sau khi tải xong
    setTimeout(() => {
        if (table) table.style.opacity = '1';
    }, 300);
}
</script>`;

    // 2. Gán hàm mới vào nút Tải lại (Không F5 trang nữa)
    html = html.replace(
        /<button[^>]*>.*?Tải lại.*?<\/button>/gi,
        `<button type="button" class="btn btn-primary" onclick="reloadStudentTableOnly()">🔄 Tải lại</button>`
    );

    // 3. Chèn script vào trước thẻ </body>
    html = html.replace(/<script id="ajax-reload-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${ajaxScript}\n</body>`);

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã chuyển nút Tải lại về chuẩn AJAX (chỉ làm mới bảng Sinh viên)!');
}
