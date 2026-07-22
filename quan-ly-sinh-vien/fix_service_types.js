const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');
    
    // Tìm và thay thế tất cả tutorId: string hoặc tutorId?: string thành number
    code = code.replace(/(tutorId|subjectId)(\??\s*:\s*)string/g, '$1$2number');
    
    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã sửa triệt để kiểu dữ liệu trong Service thành number!');
} else {
    console.log('❌ Không tìm thấy file Service!');
}
