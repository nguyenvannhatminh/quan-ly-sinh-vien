const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');
const match = /<script[\s\S]*?>([\s\S]*?)<\/script>/g.exec(html);
if (match) {
    const lines = match[1].split('\n');
    console.log("\n🔍 === KHU VỰC HIỆN TRƯỜNG CHỨA LỖI ===");
    for (let i = Math.max(0, 260); i < Math.min(lines.length, 290); i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
} else {
    console.log("Không tìm thấy thẻ script!");
}
