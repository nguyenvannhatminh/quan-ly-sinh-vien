const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Bổ sung tìm kiếm theo Mã SV (SID) bên cạnh name và email
    code = code.replace(
        /sv\.email\s+LIKE\s+:search/g,
        'sv.email LIKE :search OR CAST(sv.SID AS CHAR) LIKE :search'
    );

    fs.writeFileSync(servicePath, code, 'utf8');
    console.log('✅ Đã bổ sung tìm kiếm theo Mã sinh viên (SID) thành công!');
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
