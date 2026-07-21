const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');

const authFunc = html.match(/async function xuLyAuth[\s\S]*?\n\s*\}/);
const toggleFunc = html.match(/function toggleAuthMode[\s\S]*?\n\s*\}/);

console.log("\n🔍 === HÀM XỬ LÝ ĐĂNG NHẬP/ĐĂNG KÝ ===");
console.log(authFunc ? authFunc[0] : "❌ Không tìm thấy hàm xuLyAuth!");

console.log("\n🔍 === HÀM CHUYỂN ĐỔI GIAO DIỆN ===");
console.log(toggleFunc ? toggleFunc[0] : "❌ Không tìm thấy hàm toggleAuthMode!");
