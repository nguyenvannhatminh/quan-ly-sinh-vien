const fs = require('fs');
const path = './src/dashboard/dashboard.controller.ts';

if (fs.existsSync(path)) {
    console.log("🔍 === NỘI DUNG FILE DASHBOARD.CONTROLLER.TS ===");
    console.log(fs.readFileSync(path, 'utf8'));
    console.log("=============================================");
} else {
    // Nếu không có controller riêng biệt, kiểm tra dashboard.service.ts
    const sPath = './src/dashboard/dashboard.service.ts';
    if (fs.existsSync(sPath)) {
        console.log("🔍 === NỘI DUNG FILE DASHBOARD.SERVICE.TS ===");
        console.log(fs.readFileSync(sPath, 'utf8'));
        console.log("=============================================");
    } else {
        console.log("❌ Không tìm thấy file dashboard controller hoặc service.");
    }
}
