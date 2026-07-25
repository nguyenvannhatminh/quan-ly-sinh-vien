const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // 1. Thêm NotFoundException vào import từ @nestjs/common
    if (!code.includes('NotFoundException')) {
        if (code.includes("@nestjs/common")) {
            code = code.replace(
                /import\s*\{([^}]+)\}\s*from\s*['"]@nestjs\/common['"]/,
                (match, imports) => `import { ${imports.trim()}, NotFoundException } from '@nestjs/common'`
            );
        } else {
            code = `import { NotFoundException } from '@nestjs/common';\n` + code;
        }
    }

    // 2. Tìm tên biến Repository thực tế trong constructor (vd: svRepo, sinhVienRepo, ...)
    const repoMatch = code.match(/constructor\s*\([\s\S]*?(?:private|protected|public)\s+(?:readonly\s+)?([a-zA-Z0-9_$]+)\s*:\s*Repository/);
    let realRepoName = '';
    
    if (repoMatch && repoMatch[1]) {
        realRepoName = repoMatch[1];
    } else {
        const altMatch = code.match(/@InjectRepository\([^)]+\)\s*(?:private|protected|public)?\s*(?:readonly\s+)?([a-zA-Z0-9_$]+)/);
        if (altMatch && altMatch[1]) realRepoName = altMatch[1];
    }

    if (realRepoName && realRepoName !== 'sinhVienRepository') {
        console.log(`🔍 Tìm thấy tên Repository thực tế: this.${realRepoName}`);
        code = code.replace(/this\.sinhVienRepository/g, `this.${realRepoName}`);
    }

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã sửa lỗi NotFoundException và khớp đúng tên Repository!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
