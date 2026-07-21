const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Dọn dẹp toàn bộ các style/script tùy chỉnh gây xung đột cũ
    html = html.replace(/<style id="karl-[\s\S]*?<\/style>/gi, '');
    html = html.replace(/<script id="karl-[\s\S]*?<\/script>/gi, '');

    // 2. CSS Cứu Hóa Giao Diện (Full-width, Dark Theme chuẩn chỉnh)
    const rescueCSS = `
<style id="karl-rescue-full-layout">
    /* Reset & Khung nền chuẩn Dark Theme */
    body {
        background-color: #0F172A !important;
        color: #F8FAFC !important;
        font-family: system-ui, -apple-system, sans-serif !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Container chính mở rộng full width không bị co cụm */
    .main-content, .page-content, main, #app {
        width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
        padding: 20px !important;
    }

    /* Header & Thanh Thao Tác */
    .top-header-section {
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        margin-bottom: 24px !important;
        width: 100% !important;
    }

    .header-main-row {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 12px !important;
        width: 100% !important;
    }

    .page-title-text {
        font-size: 24px !important;
        font-weight: 700 !important;
        color: #F8FAFC !important;
        margin: 0 !important;
    }

    .action-buttons-group {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        flex-wrap: wrap !important;
    }

    /* Thanh lọc 3 ô nằm ngang phẳng phiu */
    .filter-card-row {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        background-color: #1E293B !important;
        padding: 14px 18px !important;
        border-radius: 8px !important;
        border: 1px solid #334155 !important;
        width: 100% !important;
        box-sizing: border-box !important;
        flex-wrap: wrap !important;
    }

    .filter-card-row .search-box {
        flex: 1 1 280px !important;
    }

    .filter-card-row input[type="text"] {
        width: 100% !important;
        padding: 9px 14px !important;
        background: #0F172A !important;
        border: 1px solid #475569 !important;
        border-radius: 6px !important;
        color: #F8FAFC !important;
        font-size: 14px !important;
        outline: none !important;
        box-sizing: border-box !important;
    }

    .filter-card-row select {
        flex: 0 1 200px !important;
        padding: 9px 12px !important;
        background: #0F172A !important;
        border: 1px solid #475569 !important;
        border-radius: 6px !important;
        color: #F8FAFC !important;
        font-size: 14px !important;
        outline: none !important;
        cursor: pointer !important;
        box-sizing: border-box !important;
    }

    /* Bảng Sinh Viên rộng rãi */
    table {
        width: 100% !important;
        border-collapse: collapse !important;
        color: #F8FAFC !important;
        margin-top: 15px !important;
    }

    table th {
        background-color: #0F172A !important;
        color: #94A3B8 !important;
        padding: 12px 14px !important;
        text-align: left !important;
        font-size: 13px !important;
        border-bottom: 2px solid #334155 !important;
    }

    table td {
        padding: 12px 14px !important;
        border-bottom: 1px solid #334155 !important;
        font-size: 14px !important;
        vertical-align: middle !important;
    }
</style>`;

    if (!html.includes('id="karl-rescue-full-layout"')) {
        html = html.replace('</head>', `${rescueCSS}\n</head>`);
    }

    // Đảm bảo có input file Excel ẩn
    if (!html.includes('id="excelFileInput"')) {
        html = html.replace('</body>', '<input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">\n</body>');
    }

    // 3. Khôi phục Script Master xử lý dữ liệu chuẩn đét
    const masterScript = `
<script id="karl-system-layout-master">
let currentPage = 1;

async function layDanhSachSinhVien(page = 1) {
    currentPage = page;
    const searchVal = document.getElementById('timKiemInput')?.value || '';
    const tutorVal = document.getElementById('filterTutor')?.value || '';
    const subjectVal = document.getElementById('filterSubject')?.value || '';

    let url = \`/sinh-vien?page=\${page}&limit=10&search=\${encodeURIComponent(searchVal)}\`;
    if (tutorVal) url += \`&tutorId=\${encodeURIComponent(tutorVal)}\`;
    if (subjectVal) url += \`&subjectId=\${encodeURIComponent(subjectVal)}\`;

    let tbody = document.getElementById('tbody-sinhvien');
    if (!tbody) {
        document.querySelectorAll('table').forEach(t => {
            if (t.innerText.includes('MÃ SV') || t.innerText.includes('HỌ TÊN')) {
                tbody = t.querySelector('tbody');
            }
        });
    }
    if (!tbody) tbody = document.querySelector('table tbody');

    try {
        const res = await fetch(url);
        if (!res.ok) return;

        const rawData = await res.json();
        const list = Array.isArray(rawData) ? rawData : (rawData.data || []);

        if (tbody) {
            if (list.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 25px; color: #9CA3AF;">
                            🔍 Không tìm thấy sinh viên nào phù hợp.
                        </td>
                    </tr>\`;
                return;
            }

            tbody.innerHTML = list.map(sv => {
                const id = sv.SID || sv.id || '--';
                const name = sv.name || sv.hoTen || 'Chưa đặt tên';
                const email = sv.email || '--';
                
                let tutorName = 'Chưa ĐK';
                if (sv.tutor) {
                    tutorName = typeof sv.tutor === 'object' ? (sv.tutor.name || 'Chưa ĐK') : sv.tutor;
                }

                let subjectsBadge = '<span style="color:#9CA3AF;">Trống</span>';
                if (Array.isArray(sv.subjects) && sv.subjects.length > 0) {
                    subjectsBadge = sv.subjects.map(s => {
                        const sName = typeof s === 'object' ? s.name : s;
                        return \`<span style="background:#374151; color:#F3F4F6; padding:3px 8px; border-radius:4px; font-size:12px; margin-right:4px; display:inline-block;">\${sName}</span>\`;
                    }).join('');
                }

                return \`
                    <tr>
                        <td style="text-align: center;"><input type="checkbox" class="sv-checkbox" value="\${id}" onchange="capNhatNutXoaHangLoat()"></td>
                        <td style="font-weight: 600; color: #60A5FA;">\${id}</td>
                        <td style="font-weight: bold; color: #F8FAFC;">\${name}</td>
                        <td style="color: #CBD5E1;">\${email}</td>
                        <td style="color: #94A3B8;">\${tutorName}</td>
                        <td>\${subjectsBadge}</td>
                        <td>
                            <button class="btn btn-sm" onclick="kichHoatCheDoSua(\${id})" style="background:#F59E0B; color:#fff; border:none; padding:4px 10px; border-radius:4px; margin-right:4px; cursor:pointer;">✏️ Sửa</button>
                            <button class="btn btn-sm" onclick="openGradeModal(\${id})" style="background:#0284C7; color:#fff; border:none; padding:4px 10px; border-radius:4px; margin-right:4px; cursor:pointer;">📝 Nhập điểm</button>
                            <button class="btn btn-sm" onclick="xoaSinhVien(\${id}, '\${name}')" style="background:#EF4444; color:#fff; border:none; padding:4px 10px; border-radius:4px; cursor:pointer;">🗑️</button>
                        </td>
                    </tr>\`;
            }).join('');
        }

        capNhatNutXoaHangLoat();
    } catch(err) { console.error('Lỗi API sinh viên:', err); }
}

async function xoaSinhVien(id, name) {
    if (!confirm(\`⚠️ Bạn có chắc muốn xóa sinh viên "\${name}" (Mã SV: \${id})?\`)) return;
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
    try {
        const res = await fetch('/sinh-vien/' + id, { method: 'DELETE', headers });
        if (res.ok) {
            alert('🎉 Xóa sinh viên thành công!');
            layDanhSachSinhVien(currentPage);
        } else {
            alert('❌ Xóa thất bại!');
        }
    } catch(e) { alert('❌ Lỗi kết nối server!'); }
}

function capNhatNutXoaHangLoat() {
    const selected = document.querySelectorAll('.sv-checkbox:checked');
    const btnXoa = document.getElementById('btnXoaHangLoat');
    if (btnXoa) {
        btnXoa.style.display = selected.length > 0 ? 'inline-block' : 'none';
        btnXoa.innerHTML = \`🗑️ Xóa đã chọn (\${selected.length})\`;
    }
}

async function reloadSinhVienVisual() {
    ['timKiemInput', 'filterTutor', 'filterSubject'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    await layDanhSachSinhVien(1);
}

function xuatExcelSinhVien() {
    const table = document.querySelector('table');
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

async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const tutors = await tutorRes.json();
            const list = Array.isArray(tutors) ? tutors : (tutors.data || []);
            const sel = document.getElementById('filterTutor');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + list.map(t => \`<option value="\${t.TID || t.id}">\${t.name}</option>\`).join('');
        }
        if (subjectRes.ok) {
            const subjects = await subjectRes.json();
            const list = Array.isArray(subjects) ? subjects : (subjects.data || []);
            const sel = document.getElementById('filterSubject');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + list.map(s => \`<option value="\${s.SubID || s.id}">\${s.name}</option>\`).join('');
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    napDuLieuBoLoc();
    layDanhSachSinhVien(1);
});
</script>`;

    html = html.replace('</body>', `${masterScript}\n</body>`);
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã khôi phục hoàn toàn giao diện Full Width chuẩn!');
}
