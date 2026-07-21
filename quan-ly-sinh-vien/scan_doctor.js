const fs = require('fs');

try {
    const html = fs.readFileSync('./public/index.html', 'utf8');
    const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
    let match;
    let count = 0;
    let hasError = false;

    while ((match = scriptRegex.exec(html)) !== null) {
        count++;
        const jsCode = match[1];
        try {
            // Ép Node.js biên dịch thử đoạn code để bắt lỗi cú pháp
            new Function(jsCode);
        } catch (e) {
            hasError = true;
            console.log(`\n❌ [PHÁT HIỆN LỖI CÚ PHÁP CHÍ MẠNG OỞ THẺ SCRIPT SỐ ${count}]`);
            console.log(`👉 Nội dung lỗi: ${e.message}`);
            console.log(`==================================================`);
            break;
        }
    }

    // Kiểm tra thêm biến toàn cục
    if (!hasError) {
        if (!html.includes('currentAuthMode')) {
            console.log(`\n⚠️ Cảnh báo: Thiếu khởi tạo biến 'currentAuthMode'.`);
        } else {
            console.log(`\n✅ Cú pháp cơ bản sạch sẽ! Hãy kiểm tra Console F12 trên trình duyệt.`);
        }
    }
} catch (err) {
    console.log("Không đọc được file:", err.message);
}
