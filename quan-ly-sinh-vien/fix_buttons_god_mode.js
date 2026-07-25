const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    const godModeScript = `
<!-- BỘ CỨU HỘ NÚT BẤM (GOD MODE) -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const text = btn.innerText.trim().toLowerCase();
        const isEdit = text.includes('sửa') || text.includes('edit');
        const isGrade = text.includes('nhập điểm');
        
        if (isEdit || isGrade) {
            e.preventDefault();
            e.stopPropagation();

            const tr = btn.closest('tr');
            if (!tr) return;

            // Truy tìm Mã SV (Nằm ở cột số 2, hoặc cột đầu tiên chứa số)
            let svId = null;
            const tds = tr.querySelectorAll('td');
            for (let td of tds) {
                const val = td.innerText.trim();
                if (/^\\d+$/.test(val)) {
                    svId = val;
                    break;
                }
            }

            if (!svId) {
                // Thử lấy từ hàm onclick cũ (nếu có)
                const onclickAttr = btn.getAttribute('onclick') || '';
                const match = onclickAttr.match(/\\d+/);
                if (match) svId = match[0];
            }

            if (!svId) return alert('Không tìm thấy Mã Sinh Viên ở dòng này!');

            // Xử lý bật Modal
            if (isEdit) {
                if (typeof window.openEditModal === 'function') {
                    window.openEditModal(svId);
                } else {
                    alert('Tìm thấy Mã SV: ' + svId + ' nhưng thiếu hàm bật Modal Sửa!');
                }
            } else if (isGrade) {
                if (typeof window.openGradeModal === 'function') {
                    window.openGradeModal(svId);
                } else {
                    alert('Tìm thấy Mã SV: ' + svId + ' nhưng thiếu hàm bật Modal Nhập điểm!');
                }
            }
        }
    });
});
</script>
`;

    // Dọn dẹp script cứu hộ cũ nếu có
    html = html.replace(/<!-- BỘ CỨU HỘ NÚT BẤM[\s\S]*?<\/script>/g, '');
    
    // Gắn script mới vào ngay trước thẻ đóng body
    html = html.replace('</body>', godModeScript + '\n</body>');

    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅ Đã kích hoạt Bộ Cứu Hộ Nút Bấm thành công!');
} else {
    console.log('❌ Không tìm thấy public/index.html');
}
