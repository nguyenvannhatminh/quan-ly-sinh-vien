const fs = require('fs');
const path = require('path');

// ==========================================
// 1. FIX BACKEND: Kiểm tra & Bổ sung GET /sinh-vien/:id
// ==========================================
const servicePath = './src/sinh-vien/sinh-vien.service.ts';
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';

if (fs.existsSync(servicePath)) {
    let serviceCode = fs.readFileSync(servicePath, 'utf8');
    if (!serviceCode.includes('findOne(')) {
        const findOneService = `
  async findOne(id: number) {
    const sv = await this.sinhVienRepository.findOne({
      where: { SID: id },
      relations: ['tutor', 'subjects'],
    });
    if (!sv) throw new NotFoundException('Không tìm thấy sinh viên');
    return sv;
  }
`;
        serviceCode = serviceCode.replace(/}\s*$/, findOneService + '\n}');
        fs.writeFileSync(servicePath, serviceCode, 'utf8');
        console.log('✅ Đã thêm findOne() vào Service');
    }
}

if (fs.existsSync(controllerPath)) {
    let controllerCode = fs.readFileSync(controllerPath, 'utf8');
    if (!controllerCode.includes('@Get(\':id\')') && !controllerCode.includes('@Get(\':SID\')')) {
        const findOneController = `
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sinhVienService.findOne(+id);
  }
`;
        controllerCode = controllerCode.replace(/}\s*$/, findOneController + '\n}');
        fs.writeFileSync(controllerPath, controllerCode, 'utf8');
        console.log('✅ Đã thêm Route @Get(":id") vào Controller');
    }
}

// ==========================================
// 2. FIX FRONTEND: Bắt sự kiện Click thông minh
// ==========================================
function findFiles(dir, extList, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist' && file !== '.git') {
                findFiles(filePath, extList, fileList);
            }
        } else if (extList.some(ext => file.endsWith(ext))) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const htmlFiles = findFiles('.', ['.html', '.ejs']);
const mainHtml = htmlFiles.find(f => f.includes('public')) || htmlFiles[0];

if (mainHtml) {
    let htmlContent = fs.readFileSync(mainHtml, 'utf8');

    const patchScript = `
<script>
// Handler siêu nhạy: Bắt mọi cú click vào hàng hoặc nút Sửa
document.addEventListener('click', async function(e) {
    const target = e.target;
    const btn = target.closest('button, a, .btn, svg, path, i');
    const tr = target.closest('tr');
    
    if (!tr) return;

    // Lấy thông tin nút bấm
    const html = btn ? btn.outerHTML.toLowerCase() : '';
    const text = btn ? btn.innerText.toLowerCase() : '';
    const isEditBtn = text.includes('sửa') || text.includes('edit') || html.includes('pencil') || html.includes('edit') || html.includes('yellow') || html.includes('warning');

    if (isEditBtn) {
        e.preventDefault();
        e.stopPropagation();

        // Tìm Mã SV trên dòng hiện tại
        let svId = btn ? (btn.getAttribute('data-id') || btn.getAttribute('data-sid')) : null;
        if (!svId) {
            const tds = tr.querySelectorAll('td');
            for (let td of tds) {
                const txt = td.innerText.trim();
                if (/^\\d+$/.test(txt)) {
                    svId = txt;
                    break;
                }
            }
        }

        if (svId && typeof window.openEditModal === 'function') {
            window.openEditModal(svId);
        } else if (svId) {
            alert('Đã tìm thấy Mã SV: ' + svId + ' nhưng chưa gắn Modal Sửa!');
        } else {
            console.warn('Không tìm thấy Mã SV trên dòng này');
        }
    }
});
</script>
`;

    if (!htmlContent.includes('isEditBtn')) {
        htmlContent = htmlContent.replace('</body>', patchScript + '\n</body>');
        fs.writeFileSync(mainHtml, htmlContent, 'utf8');
        console.log(`✅ Đã tích hợp Smart Click Event Handler vào: ${mainHtml}`);
    }
}
