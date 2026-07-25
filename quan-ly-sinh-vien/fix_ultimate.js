const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    // 1. Dùng vị trí index để tìm và phẫu thuật chính xác đoạn code rác
    const leakStart = html.search(/['";\s]*const\s+blob\s*=\s*new\s+Blob/i);
    
    if (leakStart !== -1) {
        // Lùi lại vài ký tự nếu có dấu ';' hoặc dư thừa phía trước
        let realStart = leakStart;
        while (realStart > 0 && ['\'', '"', ';', ' ', '\n', '\r'].includes(html[realStart - 1])) {
            realStart--;
        }

        // Tìm vị trí kết thúc (cho đến thẻ <script> tiếp theo hoặc </body>)
        let leakEnd = html.indexOf('<script', leakStart);
        const bodyEnd = html.indexOf('</body>', leakStart);

        if (leakEnd === -1 || (bodyEnd !== -1 && bodyEnd < leakEnd)) {
            leakEnd = bodyEnd !== -1 ? bodyEnd : html.length;
        }

        // Cắt bỏ hoàn toàn đoạn rác tràn màn hình
        html = html.substring(0, realStart) + '\n' + html.substring(leakEnd);
    }

    // 2. Dọn dẹp các thẻ script cứu hộ trùng lặp cũ
    html = html.replace(/<!-- BỘ XỬ LÝ[\s\S]*?<\/script>/g, '');
    html = html.replace(/<script id="[^"]*">[\s\S]*?<\/script>/g, '');

    // 3. Gắn Bộ xử lý Nút Tải lại CHUẨN XÁC & BỌC KÍN TRONG THẺ <script>
    const cleanScript = `
<!-- BỘ XỬ LÝ NÚT TẢI LẠI CHUẨN -->
<script>
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a, .btn');
        if (!btn) return;

        const txt = (btn.innerText || '').toLowerCase();
        if (txt.includes('tải lại') || txt.includes('làm mới')) {
            e.preventDefault();
            if (typeof layDanhSachMonHoc === 'function') layDanhSachMonHoc();
            if (typeof layDanhSachGiangVien === 'function') layDanhSachGiangVien();
            if (typeof layDanhSachSinhVien === 'function') layDanhSachSinhVien(1);
            if (typeof loadSubjects === 'function') loadSubjects();
            if (typeof loadTutors === 'function') loadTutors();
        }
    });
});
</script>
`;

    if (html.includes('</body>')) {
        html = html.replace('</body>', cleanScript + '\n</body>');
    } else {
        html += cleanScript;
    }

    fs.writeFileSync(file, html, 'utf8');
    console.log('🎉 ĐÃ DỌN SẠCH BẢNG TRẮNG RÁC VÀ SỬA NÚT TẢI LẠI THÀNH CÔNG!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
