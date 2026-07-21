const fs = require('fs');

// 1. CẬP NHẬT BACKEND SERVICE (Lọc linh hoạt cả ID lẫn Tên, không lo lỗi NaN)
const servicePath = './src/sinh-vien/sinh-vien.service.ts';
if (fs.existsSync(servicePath)) {
    let serviceContent = fs.readFileSync(servicePath, 'utf8');

    const flexibleFindAll = `  async findAll(page: number = 1, limit: number = 5, search: string = '', tutorFilter?: string, subjectFilter?: string) {
    const skip = (page - 1) * limit;
    const qb = this.svRepo.createQueryBuilder('sv')
      .leftJoinAndSelect('sv.tutor', 'tutor')
      .leftJoinAndSelect('sv.subjects', 'subjects')
      .orderBy('sv.SID', 'DESC');

    if (search) {
      qb.andWhere('(sv.name LIKE :search OR sv.email LIKE :search)', { search: \`%\${search}%\` });
    }

    if (tutorFilter && tutorFilter.trim() !== '') {
      const numTutor = Number(tutorFilter);
      if (!isNaN(numTutor) && numTutor > 0) {
        qb.andWhere('(tutor.TID = :numTutor OR tutor.id = :numTutor)', { numTutor });
      } else {
        qb.andWhere('tutor.name LIKE :tutorName', { tutorName: \`%\${tutorFilter}%\` });
      }
    }

    if (subjectFilter && subjectFilter.trim() !== '') {
      const numSub = Number(subjectFilter);
      if (!isNaN(numSub) && numSub > 0) {
        qb.andWhere('(subjects.SubID = :numSub OR subjects.id = :numSub)', { numSub });
      } else {
        qb.andWhere('subjects.name LIKE :subName', { subName: \`%\${subjectFilter}%\` });
      }
    }

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, lastPage: Math.ceil(total / limit) || 1 };
  }`;

    serviceContent = serviceContent.replace(/async\s+findAll\([\s\S]*?\n\s*return\s*\{[\s\S]*?\};\n\s*\}/m, flexibleFindAll);
    fs.writeFileSync(servicePath, serviceContent);
    console.log('✅ Đã nâng cấp Backend Service lọc thông minh cả ID lẫn Tên!');
}

// 2. CẬP NHẬT FRONTEND INDEX.HTML (Đảm bảo Bảng Sinh Viên luôn hiển thị chuẩn)
const htmlPath = './public/index.html';
if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Dọn dẹp script master cũ
    html = html.replace(/<script id="karl-system-[\s\S]*?<\/script>/gi, '');

    const masterScript = `
<script id="karl-system-fixed-render">
let currentPage = 1;
let totalPages = 1;

// TẢI DANH SÁCH SINH VIÊN
async function layDanhSachSinhVien(page = 1) {
    currentPage = page;
    const searchVal = document.getElementById('timKiemInput')?.value || '';
    const tutorVal = document.getElementById('filterTutor')?.value || '';
    const subjectVal = document.getElementById('filterSubject')?.value || '';

    let url = \`/sinh-vien?page=\${page}&limit=5&search=\${encodeURIComponent(searchVal)}\`;
    if (tutorVal) url += \`&tutorId=\${encodeURIComponent(tutorVal)}\`;
    if (subjectVal) url += \`&subjectId=\${encodeURIComponent(subjectVal)}\`;

    try {
        const res = await fetch(url);
        const result = await res.json();
        
        let tbody = document.getElementById('tbody-sinhvien');
        if (!tbody) {
            const tableSv = document.getElementById('table-sinhvien') || document.querySelector('table');
            if (tableSv) tbody = tableSv.querySelector('tbody');
        }

        if (tbody) {
            const list = result.data || [];
            totalPages = result.lastPage || 1;

            if (list.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 20px; color: #9CA3AF;">
                            🔍 Không tìm thấy sinh viên nào phù hợp với bộ lọc.
                        </td>
                    </tr>\`;
            } else {
                tbody.innerHTML = list.map(sv => {
                    const tutorName = sv.tutor ? sv.tutor.name : '<span style="color:#9CA3AF;">--</span>';
                    const subjects = sv.subjects && sv.subjects.length > 0 
                        ? sv.subjects.map(s => \`<span class="badge" style="background:#E2E8F0; color:#1E293B; padding:3px 8px; border-radius:4px; font-size:12px; margin-right:4px;">\${s.name}</span>\`).join('') 
                        : '<span style="color:#9CA3AF;">--</span>';

                    return \`
                        <tr>
                            <td style="text-align: center;"><input type="checkbox" class="sv-checkbox" value="\${sv.SID}" onchange="capNhatNutXoaHangLoat()"></td>
                            <td>\${sv.SID}</td>
                            <td style="font-weight: bold;">\${sv.name}</td>
                            <td>\${sv.email}</td>
                            <td>\${tutorName}</td>
                            <td>\${subjects}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="kichHoatCheDoSua(\${sv.SID})">✏️ Sửa</button>
                                <button class="btn btn-sm btn-info" onclick="openGradeModal(\${sv.SID})" style="background:#0284C7; color:#fff; border:none; padding:3px 8px; border-radius:4px;">📝 Nhập điểm</button>
                                <button class="btn btn-sm btn-danger" onclick="xoaSinhVien(\${sv.SID}, '\${sv.name}')">🗑️</button>
                            </td>
                        </tr>\`;
                }).join('');
            }
        }
        
        capNhatNutXoaHangLoat();
        updateDashboardStats();
    } catch(err) { console.error('Lỗi tải danh sách sinh viên:', err); }
}

// BẬT / TẮT CHỌN TẤT CẢ CHECKBOX
function chonTatCaSinhVien(master) {
    document.querySelectorAll('.sv-checkbox').forEach(cb => cb.checked = master.checked);
    capNhatNutXoaHangLoat();
}

// CẬP NHẬT NÚT XÓA HÀNG LOẠT
function capNhatNutXoaHangLoat() {
    const selected = document.querySelectorAll('.sv-checkbox:checked');
    const btnXoa = document.getElementById('btnXoaHangLoat');
    if (btnXoa) {
        btnXoa.style.display = selected.length > 0 ? 'inline-block' : 'none';
        btnXoa.innerHTML = \`🗑️ Xóa đã chọn (\${selected.length})\`;
    }
}

// XÓA HÀNG LOẠT
async function xoaHangLoatSinhVien() {
    const selected = Array.from(document.querySelectorAll('.sv-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    if (!confirm(\`⚠️ Bạn có chắc muốn xóa \${selected.length} sinh viên đã chọn?\`)) return;

    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};

    for (const id of selected) {
        try { await fetch('/sinh-vien/' + id, { method: 'DELETE', headers }); } catch(e) {}
    }
    alert('🎉 Xóa thành công!');
    layDanhSachSinhVien(1);
}

// TẢI LẠI BẢNG
async function reloadSinhVienVisual() {
    // Reset luôn cả các ô lọc về Mặc định khi bấm Tải lại
    const selTutor = document.getElementById('filterTutor');
    const selSub = document.getElementById('filterSubject');
    const inputSearch = document.getElementById('timKiemInput');
    if (selTutor) selTutor.value = '';
    if (selSub) selSub.value = '';
    if (inputSearch) inputSearch.value = '';

    await layDanhSachSinhVien(1);
}

// XUẤT EXCEL
function xuatExcelSinhVien() {
    const table = document.getElementById('table-sinhvien') || document.querySelector('table');
    if (!table) return;
    const cloneTable = table.cloneNode(true);
    cloneTable.querySelectorAll('tr').forEach(row => {
        if (row.children.length > 0) {
            row.children[0].remove();
            row.children[row.children.length - 1].remove();
        }
    });
    const excelHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body>' + cloneTable.outerHTML + '</body></html>';
    const blob = new Blob(['\\ufeff' + excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Danh_Sach_Sinh_Vien.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// TẢI FILE MẪU EXCEL
function taiFileExcelMau() {
    if (typeof XLSX === 'undefined') { alert('⚠️ Thư viện XLSX chưa tải xong!'); return; }
    const sampleData = [
        { "Họ và Tên": "Nguyễn Văn An", "Email": "an.nguyen@gmail.com" },
        { "Họ và Tên": "Lê Thị Bích", "Email": "bich.le@gmail.com" }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Danh sách sinh viên");
    XLSX.writeFile(wb, "Mau_Nhap_Sinh_Vien.xlsx");
}

// NHẬP EXCEL
async function xuLyImportExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            let success = 0, fail = 0;
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            for (const row of jsonData) {
                const name = row['Họ và Tên'] || row['Họ tên'] || row['Name'];
                const email = row['Email'] || row['email'];
                if (!name || !email) { fail++; continue; }

                try {
                    const res = await fetch('/sinh-vien', {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ name: String(name).trim(), email: String(email).trim() })
                    });
                    if (res.ok) success++; else fail++;
                } catch(err) { fail++; }
            }

            alert('🎉 Kết quả nhập Excel:\\n- Thành công: ' + success + ' sinh viên\\n- Thất bại: ' + fail);
            reloadSinhVienVisual();
        } catch(err) { alert('❌ Lỗi đọc file Excel!'); }
    };
    reader.readAsArrayBuffer(file);
}

// NẠP DỮ LIỆU SELECT BOX BỘ LỌC
async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const tutors = await tutorRes.json();
            const sel = document.getElementById('filterTutor');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + tutors.map(t => \`<option value="\${t.TID || t.id || t.name}">\${t.name}</option>\`).join('');
        }
        if (subjectRes.ok) {
            const subjects = await subjectRes.json();
            const sel = document.getElementById('filterSubject');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + subjects.map(s => \`<option value="\${s.SubID || s.id || s.name}">\${s.name}</option>\`).join('');
        }
    } catch(e) {}
}

// CẬP NHẬT BIỂU ĐỒ DASHBOARD
async function updateDashboardStats() {
    if (typeof Chart === 'undefined') return;
    const canvasXL = document.getElementById('chartXepLoaiCanvas');
    if (!canvasXL) return;

    try {
        const res = await fetch('/sinh-vien?page=1&limit=1000');
        const data = await res.json();
        const list = data.data || [];

        const statsXepLoai = { 'Xuất sắc': 0, 'Giỏi': 0, 'Khá': 0, 'Trung bình': 0, 'Yếu/Kém': 0, 'Chưa xếp loại': 0 };
        const statsMonHoc = {};

        list.forEach(sv => {
            if (sv.xepLoai) {
                if (statsXepLoai[sv.xepLoai] !== undefined) statsXepLoai[sv.xepLoai]++;
                else statsXepLoai['Yếu/Kém']++;
            } else {
                statsXepLoai['Chưa xếp loại']++;
            }

            if (sv.subjects) {
                sv.subjects.forEach(sub => {
                    statsMonHoc[sub.name] = (statsMonHoc[sub.name] || 0) + 1;
                });
            }
        });

        const ctxXL = canvasXL.getContext('2d');
        if (ctxXL) {
            if (window.chartXepLoai) window.chartXepLoai.destroy();
            window.chartXepLoai = new Chart(ctxXL, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statsXepLoai),
                    datasets: [{
                        data: Object.values(statsXepLoai),
                        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#6366F1', '#EF4444', '#9CA3AF']
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
            });
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        napDuLieuBoLoc();
        layDanhSachSinhVien(1);
    }, 400);
});
</script>`;

    html = html.replace('</body>', `${masterScript}\n</body>`);
    fs.writeFileSync(htmlPath, html);
    console.log('✅ Đã sửa xong Frontend render!');
}
