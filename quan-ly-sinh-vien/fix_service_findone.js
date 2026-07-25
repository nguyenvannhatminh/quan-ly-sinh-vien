const fs = require('fs');
const servicePath = './src/sinh-vien/sinh-vien.service.ts';

if (fs.existsSync(servicePath)) {
    let code = fs.readFileSync(servicePath, 'utf8');

    // 1. Tìm tên biến Repository trong constructor
    const repoMatch = code.match(/constructor\s*\([\s\S]*?(?:private|protected|public)\s+(?:readonly\s+)?([a-zA-Z0-9_$]+)\s*:\s*Repository/);
    const repoName = repoMatch ? repoMatch[1] : 'sinhVienRepository';

    // 2. Kiểm tra nếu chưa có hàm findOne
    if (!code.includes('findOne(')) {
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
        // Chèn hàm findOne ngay trước dấu ngoặc nhọn đóng cuối cùng của Class
        const lastBraceIndex = code.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            code = code.substring(0, lastBraceIndex) + findOneMethod + '\n' + code.substring(lastBraceIndex);
            fs.writeFileSync(servicePath, code, 'utf8');
            console.log('✅ Đã thêm phương thức findOne() vào SinhVienService thành công!');
        }
    } else {
        console.log('ℹ️ Hàm findOne() đã tồn tại trong Service.');
    }
} else {
    console.log('❌ Không tìm thấy file src/sinh-vien/sinh-vien.service.ts');
}
