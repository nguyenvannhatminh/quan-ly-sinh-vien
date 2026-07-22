const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');
    
    if (!code.includes('TRY_CATCH_PROTECTED')) {
        // Chèn try catch bảo vệ hàm findAll
        code = code.replace(/async\s+findAll\s*\(([\s\S]*?)\)\s*\{/, `async findAll($1) {\n    // TRY_CATCH_PROTECTED\n    try {`);
        
        // Chèn catch trước khi đóng hàm hoặc trước return cuối
        const lastReturnIndex = code.lastIndexOf('return');
        if (lastReturnIndex !== -1) {
            code = code.slice(0, lastReturnIndex) + `
    } catch (filterError) {
        console.error('⚠️ Lỗi bộ lọc DB (đã được bọc an toàn):', filterError.message);
        return { data: [], total: 0, page: Number(page) || 1, limit: Number(limit) || 10, totalPages: 0 };
    }\n    ` + code.slice(lastReturnIndex);
        }
        fs.writeFileSync(servicePath, code, 'utf8');
        console.log('🎉 Đã bọc Try-Catch bảo vệ Service thành công!');
    } else {
        console.log('ℹ️ Service đã được bọc an toàn trước đó.');
    }
}
