const fs = require('fs');
const path = './src/sinh-vien/entities/sinh-vien.entity.ts';

if (fs.existsSync(path)) {
    console.log("🔍 === NỘI DUNG FILE SINH-VIEN.ENTITY.TS ===");
    console.log(fs.readFileSync(path, 'utf8'));
    console.log("=============================================");
} else {
    // Thử tìm ở thư mục entities chung nếu không có trong thư mục module
    const altPath = './src/entities/sinh-vien.entity.ts';
    if (fs.existsSync(altPath)) {
        console.log("🔍 === NỘI DUNG FILE ENTITIES/SINH-VIEN.ENTITY.TS ===");
        console.log(fs.readFileSync(altPath, 'utf8'));
        console.log("=============================================");
    } else {
        console.log("❌ Không tìm thấy file Entity Sinh Viên ở đâu cả!");
    }
}
