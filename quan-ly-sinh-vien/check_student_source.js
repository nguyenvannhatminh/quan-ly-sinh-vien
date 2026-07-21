const fs = require('fs');

console.log("\n🕵️‍♂️ === KIỂM TRA LOGIC LƯU TRỮ SINH VIÊN ===");
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    const content = fs.readFileSync(servicePath, 'utf8');
    
    // Kiểm tra xem có dùng Repository hay mảng tạm
    if (content.includes('@InjectRepository') || content.includes('Repository<STUDENT>')) {
        console.log("✅ Service: Sinh viên ĐÃ ĐƯỢC cấu hình lưu vào Database MySQL.");
    } else {
        console.log("⚠️ Service: Sinh viên có vẻ đang dùng MẢNG TẠM (Memory Array), chưa lưu vào DB!");
    }
    
    console.log("\n🔍 Xem qua đoạn Code khởi đầu của Service:");
    console.log(content.split('\n').slice(0, 25).join('\n'));
} else {
    console.log("❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts");
}
