const fs = require('fs');
const updateDtoPath = './src/sinh-vien/dto/update-sinh-vien.dto.ts';

if (fs.existsSync(updateDtoPath)) {
    let content = fs.readFileSync(updateDtoPath, 'utf8');
    
    if (!content.includes('diemSo')) {
        if (!content.includes('IsOptional')) {
            content = "import { IsOptional } from 'class-validator';\n" + content;
        }
        content = content.replace(/}\s*$/, `\n  @IsOptional()\n  diemSo?: any;\n}`);
        fs.writeFileSync(updateDtoPath, content);
        console.log('✅ Đã cấp quyền "diemSo" cho UpdateSinhVienDto!');
    } else {
        console.log('⚠️ Update DTO đã có sẵn diemSo.');
    }
}
