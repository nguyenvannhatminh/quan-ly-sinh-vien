const fs = require('fs');

const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

// 1. Sửa Service: Khai báo tutorId và subjectId chuẩn kiểu number
if (fs.existsSync(servicePath)) {
    let serviceCode = fs.readFileSync(servicePath, 'utf8');
    
    serviceCode = serviceCode.replace(/tutorId\?\s*:\s*string/g, 'tutorId?: number');
    serviceCode = serviceCode.replace(/subjectId\?\s*:\s*string/g, 'subjectId?: number');
    
    fs.writeFileSync(servicePath, serviceCode, 'utf8');
    console.log('✅ Đã cập nhật sinh-vien.service.ts nhận kiểu number!');
}

// 2. Sửa Controller: Ép sang số (+tutorId, +subjectId) trước khi gọi Service
if (fs.existsSync(controllerPath)) {
    let controllerCode = fs.readFileSync(controllerPath, 'utf8');
    
    // Thay thế lại ép kiểu số an toàn
    controllerCode = controllerCode.replace(/tutorId \? tutorId : undefined/g, 'tutorId ? +tutorId : undefined');
    controllerCode = controllerCode.replace(/subjectId \? subjectId : undefined/g, 'subjectId ? +subjectId : undefined');
    
    fs.writeFileSync(controllerPath, controllerCode, 'utf8');
    console.log('✅ Đã cập nhật sinh-vien.controller.ts ép kiểu sang number!');
}
