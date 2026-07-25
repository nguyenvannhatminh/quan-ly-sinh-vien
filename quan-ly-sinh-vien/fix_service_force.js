const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // Tìm tên repository
    const repoMatch = code.match(/([a-zA-Z0-9_$]+)\s*:\s*Repository/);
    const repoName = repoMatch ? repoMatch[1] : 'sinhVienRepository';

    // Xóa hàm findOne cũ nếu có lỡ bị chèn sai chỗ (ngoài class)
    code = code.replace(/async findOne\s*\([\s\S]*?throw new NotFoundException[\s\S]*?return sv;\s*\}/g, '');

    const findOneMethod = `
  async findOne(id: number) {
    const sv = await this.${repoName}.findOne({
      where: { SID: id } as any,
      relations: { tutor: true, subjects: true } as any,
    });
    if (!sv) throw new NotFoundException('Không tìm thấy sinh viên');
    return sv;
  }
`;

    // Chèn hàm findOne ngay trước dấu ngoặc nhọn đóng của class
    const lastBraceIndex = code.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        code = code.substring(0, lastBraceIndex) + findOneMethod + '\n' + code.substring(lastBraceIndex);
        fs.writeFileSync(servicePath, code, 'utf8');
        console.log('✅ Đã ép chèn phương thức findOne() thành công!');
    } else {
        console.log('❌ Không tìm thấy dấu đóng class trong file service.');
    }
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
