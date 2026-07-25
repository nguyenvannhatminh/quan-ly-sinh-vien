const fs = require('fs');
const path = require('path');

function findFrontendFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') {
                findFrontendFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ejs')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = findFrontendFiles('.');
let targetFile = files.find(f => f.includes('public') && f.endsWith('.html')) || files.find(f => f.endsWith('index.html')) || files.find(f => f.endsWith('.html'));

if (targetFile) {
    let content = fs.readFileSync(targetFile, 'utf8');

    const delegationScript = `
<script>
// Tự động bắt sự kiện click nút Sửa trên toàn bộ bảng sinh viên
document.addEventListener('click', function(e) {
    const btn = e.target.closest('button') || e.target.closest('a');
    if (!btn) return;

    const btnText = btn.innerText || btn.textContent || '';
    const isEditBtn = btnText.includes('Sửa') || btnText.includes('✏️') || btn.classList.contains('btn-edit') || btn.classList.contains('edit-btn');

    if (isEditBtn) {
        e.preventDefault();
        
        // 1. Thử lấy ID từ attribute
        let svId = btn.getAttribute('data-id') || btn.getAttribute('onclick-id');

        // 2. Nếu không có attribute, tự quét cột MÃ SV trên cùng dòng <tr>
        if (!svId) {
            const tr = btn.closest('tr');
            if (tr) {
                const tds = tr.querySelectorAll('td');
                // Mã SV thường nằm ở cột 1 hoặc cột 2
                for (let td of tds) {
                    const txt = td.innerText.trim();
                    if (/^\\d+$/.test(txt)) { // Nếu là chuỗi số
                        svId = txt;
                        break;
                    }
                }
            }
        }

        if (svId && typeof window.openEditModal === 'function') {
            window.openEditModal(svId);
        } else if (!svId) {
            console.warn('Không tìm thấy Mã SV của dòng này!');
        }
    }
});
</script>
`;

    if (!content.includes('isEditBtn')) {
        content = content.replace('</body>', delegationScript + '\n</body>');
        fs.writeFileSync(targetFile, content, 'utf8');
        console.log(`✅ Đã kích hoạt bắt sự kiện nút Sửa tự động cho file: ${targetFile}`);
    } else {
        console.log('ℹ️ Đã cài đặt script bắt sự kiện nút Sửa rồi.');
    }
} else {
    console.log('❌ Không tìm thấy file HTML giao diện.');
}
