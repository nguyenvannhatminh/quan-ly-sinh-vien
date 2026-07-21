const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Xóa sổ cụm dashboard tạm bợ gây xấu giao diện
    content = content.replace(/<!-- === KHU VỰC DASHBOARD THỐNG KÊ \(ĐÃ FIX LAYOUT\) === -->[\s\S]*?<!-- =================================== -->/g, '');
    content = content.replace(/<!-- === KHU VỰC DASHBOARD THỐNG KÊ === -->[\s\S]*?<!-- =================================== -->/g, '');
    fs.writeFileSync(file, content);
    console.log("🧹 [CLEANED] Đã xóa bỏ khung Dashboard thô sơ thành công!");

    console.log("\n🔍 === KHẢO SÁT VÙNG HTML DASHBOARD GỐC ===");
    const keywords = ['Sinh viên toàn trường', 'Giảng viên', 'Môn học đang mở'];
    
    keywords.forEach(keyword => {
        const idx = content.indexOf(keyword);
        if (idx !== -1) {
            console.log(`\n📍 Khối chứa từ khóa [${keyword}]:`);
            // Lấy 150 ký tự trước và 100 ký tự sau từ khóa để tìm thẻ chứa số
            console.log("--------------------------------------------------");
            console.log(content.substring(idx - 150, idx + 100).trim());
            console.log("--------------------------------------------------");
        } else {
            console.log(`❌ Không tìm thấy từ khóa: ${keyword}`);
        }
    });
} else {
    console.log("❌ Không tìm thấy file public/index.html");
}
