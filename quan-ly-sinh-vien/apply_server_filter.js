const fs = require('fs');

// 1. CẬP NHẬT CONTROLLER (src/sinh-vien/sinh-vien.controller.ts)
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';
if (fs.existsSync(controllerPath)) {
    const controllerCode = `import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SinhVienService } from './sinh-vien.service';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';

@Controller('sinh-vien')
export class SinhVienController {
  constructor(private readonly sinhVienService: SinhVienService) {}

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
    @Query('search') search: string = '',
    @Query('tutorId') tutorId?: string,
    @Query('subjectId') subjectId?: string,
  ) {
    return this.sinhVienService.findAll(+page, +limit, search, tutorId ? +tutorId : undefined, subjectId ? +subjectId : undefined);
  }

  @Post()
  @Roles(Role.ADMIN, Role.GIAOVU)
  create(@Body() body: any) {
    return this.sinhVienService.create(body);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.GIAOVU)
  update(@Param('id') id: string, @Body() body: any) {
    return this.sinhVienService.update(+id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.GIAOVU)
  remove(@Param('id') id: string) {
    return this.sinhVienService.remove(+id);
  }
}
`;
    fs.writeFileSync(controllerPath, controllerCode);
    console.log('✅ Đã nâng cấp Controller hỗ trợ tham số query tutorId & subjectId!');
}

// 2. CẬP NHẬT SERVICE (src/sinh-vien/sinh-vien.service.ts)
const servicePath = './src/sinh-vien/sinh-vien.service.ts';
if (fs.existsSync(servicePath)) {
    let serviceContent = fs.readFileSync(servicePath, 'utf8');

    // Thay thế hàm findAll cũ bằng hàm findAll dùng QueryBuilder lọc trực tiếp DB
    const newFindAll = `  async findAll(page: number = 1, limit: number = 5, search: string = '', tutorId?: number, subjectId?: number) {
    const skip = (page - 1) * limit;
    const qb = this.svRepo.createQueryBuilder('sv')
      .leftJoinAndSelect('sv.tutor', 'tutor')
      .leftJoinAndSelect('sv.subjects', 'subjects')
      .orderBy('sv.SID', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      qb.andWhere('(sv.name LIKE :search OR sv.email LIKE :search)', { search: \`%\${search}%\` });
    }

    if (tutorId) {
      qb.andWhere('tutor.TID = :tutorId', { tutorId });
    }

    if (subjectId) {
      qb.andWhere('subjects.SubID = :subjectId', { subjectId });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, lastPage: Math.ceil(total / limit) || 1 };
  }`;

    serviceContent = serviceContent.replace(/async\s+findAll\([\s\S]*?\n\s*return\s*\{[\s\S]*?\};\n\s*\}/m, newFindAll);
    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ Đã cập nhật Service dùng QueryBuilder lọc Server-side chuẩn DB!');
}

// 3. CẬP NHẬT FRONTEND (public/index.html)
const htmlPath = './public/index.html';
if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Cập nhật hàm layDanhSachSinhVien gửi kèm tham số lọc về Server
    const updatedLayDanhSachScript = `
async function layDanhSachSinhVien(page = 1) {
    if (typeof currentPage !== 'undefined') currentPage = page;
    const searchVal = document.getElementById('timKiemInput')?.value || '';
    const tutorVal = document.getElementById('filterTutor')?.value || '';
    const subjectVal = document.getElementById('filterSubject')?.value || '';

    let url = \`/sinh-vien?page=\${page}&limit=\${typeof limitSize !== 'undefined' ? limitSize : 5}&search=\${encodeURIComponent(searchVal)}\`;
    if (tutorVal) url += \`&tutorId=\${tutorVal}\`;
    if (subjectVal) url += \`&subjectId=\${subjectVal}\`;

    try {
        const res = await fetch(url);
        const result = await res.json();
        
        // Cập nhật bảng nếu có hàm render hoặc gọi lại giao diện gốc
        if (typeof renderSinhVienTable === 'function') {
            renderSinhVienTable(result);
        } else {
            // Tải lại trang hoặc cập nhật DOM mặc định
            const tbody = document.querySelector('table tbody');
            if (tbody && result.data) {
                tbody.innerHTML = result.data.map(sv => {
                    const tutorName = sv.tutor ? sv.tutor.name : '<span class="text-muted">--</span>';
                    const subjects = sv.subjects && sv.subjects.length > 0 
                        ? sv.subjects.map(s => \`<span class="badge bg-secondary me-1">\${s.name}</span>\`).join('') 
                        : '<span class="text-muted">--</span>';
                    return \`
                        <tr>
                            <td>\${sv.SID}</td>
                            <td class="fw-bold">\${sv.name}</td>
                            <td>\${sv.email}</td>
                            <td>\${tutorName}</td>
                            <td>\${subjects}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="kichHoatCheDoSua(\${sv.SID})">✏️ Sửa</button>
                                <button class="btn btn-sm btn-info" onclick="openGradeModal(\${sv.SID})">📝 Nhập điểm</button>
                                <button class="btn btn-sm btn-danger" onclick="xoaSinhVien(\${sv.SID}, '\${sv.name}')">🗑️</button>
                            </td>
                        </tr>\`;
                }).join('');
            }
        }
    } catch(err) { console.error('Lỗi tải danh sách:', err); }
}

async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const tutors = await tutorRes.json();
            const sel = document.getElementById('filterTutor');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + tutors.map(t => \`<option value="\${t.TID}">\${t.name}</option>\`).join('');
        }
        if (subjectRes.ok) {
            const subjects = await subjectRes.json();
            const sel = document.getElementById('filterSubject');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + subjects.map(s => \`<option value="\${s.SubID}">\${s.name}</option>\`).join('');
        }
    } catch(e) {}
}

function xuLyLocNangCao() {
    layDanhSachSinhVien(1);
}
`;

    // Thay đổi ô Lọc gọi trực tiếp hàm layDanhSachSinhVien(1)
    html = html.replace(/id="filterTutor"[^>]*onchange=".*?"/gi, 'id="filterTutor" class="form-select" onchange="layDanhSachSinhVien(1)"');
    html = html.replace(/id="filterSubject"[^>]*onchange=".*?"/gi, 'id="filterSubject" class="form-select" onchange="layDanhSachSinhVien(1)"');
    html = html.replace(/id="timKiemInput"[^>]*oninput=".*?"/gi, 'id="timKiemInput" class="form-control" oninput="layDanhSachSinhVien(1)"');

    // Chèn script xử lý mới
    html = html.replace('</body>', `<script id="server-filter-script">\n${updatedLayDanhSachScript}\n</script>\n</body>`);

    fs.writeFileSync(htmlPath, html);
    console.log('✅ Đã kết nối Frontend trực tiếp với Bộ Lọc Server-Side!');
}
