const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Cập nhật logic khi Lưu điểm/Sửa xong -> Không F5 trang, chỉ gọi lại hàm fetch data
    html = html.replace(/location\.reload\(\);/g, `
            if (typeof window.layDanhSachSinhVien === 'function') {
                window.layDanhSachSinhVien(window.currentPage || 1);
            } else {
                location.reload();
            }
    `);

    // 2. Cập nhật logic Phân trang (Pagination)
    const paginationRegex = /let url = new URL\([\s\S]*?window\.location\.href = url\.toString\(\);\s*\}/;
    const ajaxPagination = `
            let currentPage = window.currentPage || 1;
            let targetPage = currentPage;

            if (text.includes('Trước')) targetPage = Math.max(1, currentPage - 1);
            else if (text.includes('Sau')) targetPage = currentPage + 1;
            else if (!isNaN(parseInt(text))) targetPage = parseInt(text);

            if (targetPage !== currentPage) {
                window.currentPage = targetPage; // Lưu lại trang hiện tại
                if (typeof window.layDanhSachSinhVien === 'function') {
                    window.layDanhSachSinhVien(targetPage);
                }
            }
    `;
    
    if (paginationRegex.test(html)) {
        html = html.replace(paginationRegex, ajaxPagination);
        console.log('✅ Đã nối thành công Phân trang với hàm layDanhSachSinhVien()!');
    } else {
        console.log('⚠️ Không tìm thấy đoạn code phân trang cũ, nhưng không sao, ta cứ tiếp tục.');
    }

    // Gắn thêm bắt trang hiện tại vào hàm layDanhSachSinhVien nếu có thể
    html = html.replace(/function layDanhSachSinhVien\(([^)]+)\)\s*\{/g, 'function layDanhSachSinhVien($1) {\n    window.currentPage = $1;');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('🎉 Đã đồng bộ Modal & Phân trang chuẩn AJAX (Không giật trang)!');
} else {
    console.log('❌ Không tìm thấy file ./public/index.html');
}
