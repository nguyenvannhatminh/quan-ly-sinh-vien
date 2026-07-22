const fs = require('fs');

const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let content = fs.readFileSync(servicePath, 'utf8');
    
    // Nới rộng kiểu dữ liệu tutorId và subjectId thành 'any' để chấp nhận cả number lẫn string
    content = content.replace(/tutorId(\??)\s*:\s*[^,)]+/g, 'tutorId$1: any');
    content = content.replace(/subjectId(\??)\s*:\s*[^,)]+/g, 'subjectId$1: any');
    
    fs.writeFileSync(servicePath, content, 'utf8');
    console.log('🎉 Đã cập nhật thành công sinh-vien.service.ts!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
