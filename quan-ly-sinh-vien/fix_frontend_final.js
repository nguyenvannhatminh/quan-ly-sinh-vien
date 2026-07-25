const fs = require('fs');
const path = require('path');

function findHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory() && !['node_modules', 'dist', '.git'].includes(file)) {
            findHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html') || file.endsWith('.ejs')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findHtmlFiles('.');
const targetFile = htmlFiles.find(f => f.includes('public') || f.includes('views') || f.includes('frontend')) || htmlFiles[0];

if (targetFile) {
    let content = fs.readFileSync(targetFile, 'utf8');

    // 1. Dọn dẹp các đoạn script cũ lỡ chèn trước đó (nếu có) để tránh xung đột
    content = content.replace(/<script>\s*\/\/ Tự động bắt sự kiện[\s\S]*?<\/script>/g, '');
    content = content.replace(/<script>\s*\/\/ Handler siêu nhạy[\s\S]*?<\/script>/g, '');
    content = content.replace(/<script id="ultimate-fix">[\s\S]*?<\/script>/g, '');

    // 2. Chèn kịch bản fix toàn diện (Ultimate Fix)
    const fixScript = `
<script id="ultimate-fix">
document.addEventListener('DOMContentLoaded', () => {
    
    // --- FIX 1: PHÂN TRANG (PAGINATION) ---
    document.body.addEventListener('click', (e) => {
        const pageBtn = e.target.closest('.pagination a, .pagination button, [class*="page-item"]');
        if (!pageBtn) return;
        
        e.preventDefault();
        const text = pageBtn.innerText.trim().toLowerCase();
        let url = new URL(window.location.href);
        let currentPage = parseInt(url.searchParams.get('page')) || 1;
        let targetPage = currentPage;

        if (text.includes('trước') || text.includes('prev')) {
            targetPage = Math.max(1, currentPage - 1);
        } else if (text.includes('sau') || text.includes('next')) {
            targetPage = currentPage + 1;
        } else if (!isNaN(parseInt(text))) {
            targetPage = parseInt(text);
        }

        if (targetPage !== currentPage) {
            url.searchParams.set('page', targetPage);
            // Nếu web đang dùng JS để load, thử gọi hàm load. Nếu không có hàm đó, tự động reload lại trang với param ?page=...
            if (typeof window.loadStudentList === 'function') {
                window.loadStudentList(targetPage);
            } else {
                window.location.href = url.toString();
            }
        }
    });

    // --- FIX 2: NÚT SỬA & MỞ MODAL ---
    document.body.addEventListener('click', async (e) => {
        const btn = e.target.closest('button, .btn, a');
        if (!btn) return;

        const html = btn.innerHTML.toLowerCase();
        const text = btn.innerText.toLowerCase();
        const isEdit = text.includes('sửa') || html.includes('pencil') || btn.classList.contains('edit');
        
        if (isEdit) {
            e.preventDefault();
            const tr = btn.closest('tr');
            if (!tr) return;

            // Tìm Mã SV
            let svId = btn.getAttribute('data-id');
            if (!svId) {
                const tds = Array.from(tr.querySelectorAll('td'));
                const idTd = tds.find(td => /^\\d+$/.test(td.innerText.trim()));
                if (idTd) svId = idTd.innerText.trim();
            }

            if (svId) {
                console.log('📌 Bắt được sự kiện Sửa cho Mã SV:', svId);
                // Nếu Frontend đã có hàm mở Modal thì gọi ngay
                if (typeof window.openEditModal === 'function') {
                    window.openEditModal(svId);
                    return;
                }
                
                // Nếu không có hàm dựng sẵn, tự động Fetch API và tìm Modal để mở
                try {
                    const res = await fetch('/sinh-vien/' + svId);
                    if (!res.ok) throw new Error('API báo lỗi');
                    const data = await res.json();
                    
                    alert('Lấy dữ liệu SV ' + data.name + ' thành công! Giao diện cần gắn ID cho Modal để hiển thị.');
                    console.log('Dữ liệu API trả về:', data);
                } catch (err) {
                    alert('Lấy dữ liệu thất bại, vui lòng kiểm tra lại API! Lỗi: ' + err.message);
                }
            }
        }
    });
});
</script>
`;
    content = content.replace('</body>', fixScript + '\n</body>');
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✅ Đã chèn Ultimate Fix Script (Phân trang + Sửa) vào file: ' + targetFile);
} else {
    console.log('❌ Không tìm thấy file HTML giao diện chính.');
}
