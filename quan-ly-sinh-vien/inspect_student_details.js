const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');

console.log("\n🔍 === CHI TIẾT FORM SINH VIÊN HOÀN CHỈNH ===");
const formMatch = html.match(/<form id="formSinhVien"[\s\S]*?<\/form>/);
console.log(formMatch ? formMatch[0] : "❌ Không tìm thấy formSinhVien");

console.log("\n🔍 === KHU VỰC HIỂN THỊ BẢNG SÌNH VIÊN ===");
const listMatch = html.match(/async function layDanhSachSinhVien[\s\S]*?result\.data\.forEach[\s\S]*?\}\);/);
if (listMatch) {
    console.log(listMatch[0]);
} else {
    const shortMatch = html.match(/async function layDanhSachSinhVien[\s\S]*?<\/script>/);
    if (shortMatch) console.log(shortMatch[0].substring(0, 500));
}
