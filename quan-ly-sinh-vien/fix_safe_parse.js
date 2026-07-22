const fs = require('fs');
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';

if (fs.existsSync(controllerPath)) {
    let controllerCode = fs.readFileSync(controllerPath, 'utf8');
    
    // Thay thế đoạn ép kiểu cứng nhắc bằng ép kiểu an toàn
    controllerCode = controllerCode.replace(/tutorId \? \+tutorId : undefined/g, '(tutorId && !isNaN(Number(tutorId))) ? Number(tutorId) : undefined');
    controllerCode = controllerCode.replace(/subjectId \? \+subjectId : undefined/g, '(subjectId && !isNaN(Number(subjectId))) ? Number(subjectId) : undefined');
    
    fs.writeFileSync(controllerPath, controllerCode, 'utf8');
    console.log('✅ Đã bọc thép Controller: Ép kiểu an toàn, chống sập Server!');
} else {
    console.log('❌ Không tìm thấy file Controller!');
}
