const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let serviceContent = fs.readFileSync(servicePath, 'utf8');

    // 1. Thay thế kiểu dữ liệu của tutorId và subjectId thành (number | string) hoặc number
    // Giúp TypeScript chấp nhận cả kiểu số lẫn kiểu chuỗi truyền vào
    serviceContent = serviceContent.replace(/tutorId(\??)\s*:\s*string/g, 'tutorId$1: number | string');
    serviceContent = serviceContent.replace(/subjectId(\??)\s*:\s*string/g, 'subjectId$1: number | string');

    // 2. Phòng trường hợp định nghĩa tham số trong findAll không có dấu '?'
    serviceContent = serviceContent.replace(/tutorId:\s*string/g, 'tutorId: number | string');
    serviceContent = serviceContent.replace(/subjectId:\s*string/g, 'subjectId: number | string');

    fs.writeFileSync(servicePath, serviceContent, 'utf8');
    console.log('🎉 Đã cập nhật Type Definition trong sinh-vien.service.ts thành công!');
} else {
    console.log('❌ Không tìm thấy file ./src/sinh-vien/sinh-vien.service.ts');
}
