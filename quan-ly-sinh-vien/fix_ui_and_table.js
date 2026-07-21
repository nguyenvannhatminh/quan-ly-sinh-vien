const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Dọn dẹp script master cũ
    html = html.replace(/<script id="karl-system-[\s\S]*?<\/script>/gi, '');

    // 2. Định dạng lại CSS cho Bộ lọc không bao giờ bị đè chữ / rớt dòng
    const filterFixCSS = `
<style id="karl-custom-layout-fix">
    .filter-container, .search-filter-bar, div:has(> #timKiemInput) {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 10px !important;
        align-items: center !important;
        margin-bottom: 20px !important;
    }
    input[type="text"], select {
        box-sizing: border-box !important;
    }
    table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 15px !important;
    }
    table th, table td {
        padding: 12px 15px !important;
        text-align: left !important;
        border-bottom: 1px solid #374151 !important;
    }
</style>
`;

    if (!html.includes('id="karl-custom-layout-fix"')) {
        html = html.replace('</head>', `${filterFixCSS}\n</head>`);
    }

    // Gán ID cho tbody sinh viên
    html = html.replace(/(<table[^>]*>[\s\S]*?MÃ SV[\s\S]*?)(<tbody>)/i, '$1<tbody id="tbody-sinhvien">');

    // 3. SCRIPT RENDER BẢNG SIÊU BỀN
    const masterScript = `
<script id="karl-system-ultimate-fix">
async function layDanhSachSinhVien(page = 1) {
    const searchVal = document.getElementById('timKiemInput')?.value || '';
    const tutorVal = document.getElementById('filterTutor')?.value || '';
    const subjectVal = document.getElementById('filterSubject')?.value || '';

    let url = \`/sinh-vien?page=\${page}&limit=10&search=\${encodeURIComponent(searchVal)}\`;
    if (tutorVal) url += \`&tutorId=\${encodeURIComponent(tutorVal)}\`;
    if (subjectVal) url += \`&subjectId=\${encodeURIComponent(subjectVal)}\`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('API Error: ' + res.status);
        
        const rawData = await res.json();
        // Hỗ trợ cả dạng mảng [] lẫn object { data: [] }
        const list = Array.isArray(rawData) ? rawData : (rawData.data || []);

        let tbody = document.getElementById('tbody-sinhvien');
        if (!tbody) {
            const tables = document.querySelectorAll('table');
            tables.forEach(t => {
                if (t.innerText.includes('MÃ SV') || t.innerText.includes('HỌ TÊN')) {
                    tbody = t.querySelector('tbody');
                }
            });
        }

        if (!tbody) {
            tbody = document.querySelector('table tbody');
        }

        if (tbody) {
            if (!list || list.length === 0) {
                tbody.innerHTML = \`
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 25px; color: #9CA3AF; font-size: 14px;">
                            📂 Chưa có dữ liệu sinh viên nào hoặc không tìm thấy kết quả phù hợp.
                        </td>
                    </tr>\`;
                return;
            }

            tbody.innerHTML = list.map(sv => {
                const id = sv.SID || sv.id || sv.id_sv || '--';
                const name = sv.name || sv.hoTen || sv.ten || 'Chưa tên';
                const email = sv.email || '--';
                
                // Giảng viên cố vấn
                let tutorName = '--';
                if (sv.tutor) {
                    tutorName = typeof sv.tutor === 'object' ? (sv.tutor.name || sv.tutor.hoTen || '--') : sv.tutor;
                }

                // Môn học
                let subjectsBadge = '<span style="color:#9CA3AF;">--</span>';
                if (Array.isArray(sv.subjects) && sv.subjects.length > 0) {
                    subjectsBadge = sv.subjects.map(s => {
                        const sName = typeof s === 'object' ? (s.name || s.tenMon) : s;
                        return \`<span style="background:#374151; color:#F3F4F6; padding:3px 8px; border-radius:4px; font-size:12px; margin-right:4px; display:inline-block;">\${sName}</span>\`;
                    }).join('');
                }

                return \`
                    <tr style="border-bottom: 1px solid #2D3748;">
                        <td style="text-align: center;"><input type="checkbox" class="sv-checkbox" value="\${id}" onchange="capNhatNutXoaHangLoat()"></td>
                        <td style="font-weight: 600; color: #60A5FA;">\${id}</td>
                        <td style="font-weight: bold; color: #F3F4F6;">\${name}</td>
                        <td style="color: #D1D5DB;">\${email}</td>
                        <td style="color: #9CA3AF;">\${tutorName}</td>
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
    } catch(err) {
        console.error('Lỗi khi tải sinh viên:', err);
    }
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

// CÁC HÀM TẢI LẠI VÀ BỘ LỌC
async function reloadSinhVienVisual() {
    ['timKiemInput', 'filterTutor', 'filterSubject'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    await layDanhSachSinhVien(1);
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
    console.log('✅ Đã fix giao diện đè chữ và khôi phục bảng dữ liệu!');
}
