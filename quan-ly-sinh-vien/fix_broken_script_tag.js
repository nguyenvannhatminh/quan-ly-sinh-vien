const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let html = fs.readFileSync(file, 'utf8');

    // Tìm vị trí chữ bị lộ (đoạn rác trên màn hình)
    const target = "const blob = new Blob";
    const idx = html.indexOf(target);

    if (idx !== -1) {
        // 1. Tìm thẻ </script> gần nhất phía trước để chèn thẻ mở <script> mới
        let prevClose = html.lastIndexOf('</script>', idx);
        if (prevClose !== -1) {
            html = html.substring(0, prevClose + 9) + '\n<script>\n' + html.substring(prevClose + 9);
        }
        
        // 2. Tìm thẻ <script> hoặc </body> tiếp theo để chèn thẻ đóng </script>
        // Do bước 1 đã chèn thêm chuỗi vào, ta phải tìm lại index
        const newIdx = html.indexOf(target); 
        let nextOpen = html.indexOf('<script', newIdx);
        let bodyClose = html.indexOf('</body>', newIdx);
        
        let endIdx = -1;
        if (nextOpen !== -1 && bodyClose !== -1) endIdx = Math.min(nextOpen, bodyClose);
        else if (nextOpen !== -1) endIdx = nextOpen;
        else if (bodyClose !== -1) endIdx = bodyClose;
        
        if (endIdx !== -1) {
            html = html.substring(0, endIdx) + '\n</script>\n' + html.substring(endIdx);
        }
        
        fs.writeFileSync(file, html, 'utf8');
        console.log('✅ Đã bọc lại thẻ <script> thành công! Đoạn code rác đã được giấu đi.');
    } else {
        console.log('⚠️ Không tìm thấy đoạn rò rỉ nào!');
    }
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
