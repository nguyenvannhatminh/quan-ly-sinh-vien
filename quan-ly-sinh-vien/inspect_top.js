const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');
const match = /<script[\s\S]*?>([\s\S]*?)<\/script>/.exec(html);

if (match) {
    const lines = match[1].split('\n');
    console.log("\n🔍 === 40 DÒNG ĐẦU TIÊN CỦA THẺ SCRIPT ===");
    console.log(lines.slice(0, 40).join('\n'));
    
    console.log("\n🔍 === KIỂM TRA SỰ TỒN TẠI CỦA CÁC THÀNH PHẦN === ");
    console.log("Khởi tạo currentAuthMode?:", html.includes('currentAuthMode') ? "Có" : "❌ Không");
    console.log("Hàm checkLoginState?:", html.includes('function checkLoginState') ? "Có" : "❌ Không");
} else {
    console.log("❌ Không tìm thấy thẻ script nào!");
}
