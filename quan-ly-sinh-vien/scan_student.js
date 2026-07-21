const fs = require('fs');

try {
    const html = fs.readFileSync('./public/index.html', 'utf8');
    
    console.log("🔍 === KẾT QUẢ QUÉT MODULE STUDENT === 🔍");
    
    // Kiểm tra Form HTML
    if (html.includes('id="formSinhVien"')) {
        console.log("✅ Giao diện: Đã tìm thấy formSinhVien.");
    } else {
        console.log("❌ Giao diện: CHƯA CÓ formSinhVien.");
    }

    // Kiểm tra các hàm chức năng xử lý
    const requiredFunctions = ['themSinhVien', 'xoaSinhVien', 'kichHoatCheDoSuaSinhVien', 'huyCheDoSuaSinhVien'];
    
    requiredFunctions.forEach(func => {
        if (html.includes(`function ${func}`) || html.includes(`async function ${func}`)) {
            console.log(`✅ Logic: Đã có hàm ${func}`);
        } else {
            console.log(`❌ Logic: Thiếu hàm ${func}`);
        }
    });
    
    console.log("=========================================");
} catch (e) {
    console.log("Không đọc được file: ", e.message);
}
