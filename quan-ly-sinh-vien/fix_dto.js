const fs = require('fs');
const createDtoPath = './src/sinh-vien/dto/create-sinh-vien.dto.ts';

if (fs.existsSync(createDtoPath)) {
    let content = fs.readFileSync(createDtoPath, 'utf8');
    
    // Nếu chưa có khai báo diemSo thì thêm vào
    if (!content.includes('diemSo')) {
        // Đảm bảo có import IsOptional từ class-validator
        if (!content.includes('IsOptional')) {
            content = "import { IsOptional } from 'class-validator';\n" + content;
        }
        
        // Chèn thêm thuộc tính diemSo vào trước dấu } cuối cùng của class
        content = content.replace(/}\s*$/, `\n  @IsOptional()\n  diemSo?: any;\n}`);
        
        fs.writeFileSync(createDtoPath, content);
        console.log('✅ Đã cấp quyền cho trường "diemSo" đi qua DTO thành công!');
    } else {
        console.log('⚠️ Trường "diemSo" đã có sẵn trong DTO.');
    }
} else {
    console.log('❌ Không tìm thấy file create-sinh-vien.dto.ts');
}
