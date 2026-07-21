const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Dọn sạch script Master cũ
    html = html.replace(/<script id="karl-system-master-clean">[\s\S]*?<\/script>/gi, '');
    html = html.replace(/<script id=".*?"[\s\S]*?<\/script>/gi, '');

    // 2. Thêm ID phân biệt cho các Bảng nếu chưa có
    // Bảng sinh viên
    if (!html.includes('id="table-sinhvien"')) {
        html = html.replace(/(<table[^>]*>)/i, '$1'); 
    }

    // 3. Đóng gói lại Master Script có kiểm tra Tab/Trang chính xác
    const cleanMasterScript = `
<script id="karl-system-isolated-master">
let chartXepLoai = null;
let chartMonHoc = null;

// Kiểm tra xem hiện tại có đang ở Tab / Trang Quản lý Sinh viên không
function isSinhVienPage() {
    const pageHeader = document.querySelector('h2, h3, h4, .card-title, .page-title');
    const headerText = pageHeader ? pageHeader.innerText.toLowerCase() : '';
    return headerText.includes('sinh viên') || headerText.includes('student') || document.getElementById('filterTutor') !== null;
}

// TẢI DANH SÁCH SINH VIÊN (Chỉ chạy khi đúng trang Sinh viên)
async function layDanhSachSinhVien(page = 1) {
    if (!isSinhVienPage()) return; // Nếu đang ở trang Giảng viên/Môn học thì DỪNG NGAY

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
        
        // Tìm đúng bảng sinh viên (bảng nằm trong khu vực quản lý sinh viên)
        const tbody = document.querySelector('table tbody');
        if (tbody && result.data && isSinhVienPage()) {
            tbody.innerHTML = result.data.map(sv => {
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
        
        capNhatNutXoaHangLoat();
        updateDashboardStats();
    } catch(err) { console.error('Lỗi tải danh sách sinh viên:', err); }
}

// BẬT / TẮT CHỌN TẤT CẢ CHECKBOX
function chonTatCaSinhVien(master) {
    document.querySelectorAll('.sv-checkbox').forEach(cb => cb.checked = master.checked);
    capNhatNutXoaHangLoat();
}

// CẬP NHẬT TRẠNG THÁI NÚT XÓA HÀNG LOẠT
function capNhatNutXoaHangLoat() {
    const selected = document.querySelectorAll('.sv-checkbox:checked');
    const btnXoa = document.getElementById('btnXoaHangLoat');
    if (btnXoa) {
        if (selected.length > 0) {
            btnXoa.style.display = 'inline-block';
            btnXoa.innerHTML = \`🗑️ Xóa đã chọn (\${selected.length})\`;
        } else {
            btnXoa.style.display = 'none';
        }
    }
}

// XÓA HÀNG LOẠT SINH VIÊN
async function xoaHangLoatSinhVien() {
    const selected = Array.from(document.querySelectorAll('.sv-checkbox:checked')).map(cb => cb.value);
    if (selected.length === 0) return;
    
    if (!confirm(\`⚠️ Bạn có chắc chắn muốn xóa \${selected.length} sinh viên đã chọn?\`)) return;

    const token = localStorage.getItem('token');
    const headers = {};
    if (token) headers['Authorization'] = 'Bearer ' + token;

    let success = 0;
    for (const id of selected) {
        try {
            const res = await fetch('/sinh-vien/' + id, { method: 'DELETE', headers });
            if (res.ok) success++;
        } catch(e) {}
    }

    alert(\`🎉 Đã xóa thành công \${success}/\${selected.length} sinh viên!\`);
    const selectAll = document.getElementById('selectAllSv');
    if (selectAll) selectAll.checked = false;
    layDanhSachSinhVien(1);
}

// TẢI LẠI TRANG
async function reloadSinhVienVisual() {
    if (!isSinhVienPage()) {
        location.reload();
        return;
    }
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        tbody.style.opacity = '0.3';
        await layDanhSachSinhVien(typeof currentPage !== 'undefined' ? currentPage : 1);
        setTimeout(() => { tbody.style.opacity = '1'; }, 300);
    }
}

// XUẤT EXCEL (CHỈ XUẤT BẢNG SINH VIÊN)
function xuatExcelSinhVien() {
    if (!isSinhVienPage()) return;
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
    a.download = 'Danh_Sach_Sinh_Vien_' + new Date().toISOString().slice(0,10) + '.xls';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// TẢI FILE MẪU EXCEL
function taiFileExcelMau() {
    if (typeof XLSX === 'undefined') { alert('⚠️ Thư viện XLSX chưa sẵn sàng!'); return; }
    const sampleData = [
        { "Họ và Tên": "Nguyễn Văn An", "Email": "an.nguyen@gmail.com" },
        { "Họ và Tên": "Lê Thị Bích", "Email": "bich.le@gmail.com" },
        { "Họ và Tên": "Trần Quang Cường", "Email": "cuong.tran@gmail.com" }
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

            if (!jsonData || jsonData.length === 0) { alert('⚠️ File Excel trống!'); return; }

            let success = 0, fail = 0;
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            for (const row of jsonData) {
                const name = row['Họ và Tên'] || row['Họ tên'] || row['HỌ TÊN'] || row['HO TEN'] || row['Name'] || row['name'];
                const email = row['Email'] || row['EMAIL'] || row['email'];
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

            alert('🎉 Kết quả nhập Excel:\\n- Thành công: ' + success + ' sinh viên\\n- Thất bại/Bỏ qua: ' + fail);
            reloadSinhVienVisual();
        } catch(err) { alert('❌ Lỗi đọc file Excel!'); }
    };
    reader.readAsArrayBuffer(file);
}

// NẠP DỮ LIỆU SELECT BOX BỘ LỌC
async function napDuLieuBoLoc() {
    if (!isSinhVienPage()) return;
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
            if (chartXepLoai) chartXepLoai.destroy();
            chartXepLoai = new Chart(ctxXL, {
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

        const canvasMH = document.getElementById('chartMonHocCanvas');
        if (canvasMH) {
            const ctxMH = canvasMH.getContext('2d');
            if (chartMonHoc) chartMonHoc.destroy();
            chartMonHoc = new Chart(ctxMH, {
                type: 'bar',
                data: {
                    labels: Object.keys(statsMonHoc).length > 0 ? Object.keys(statsMonHoc) : ['Chưa có môn'],
                    datasets: [{
                        label: 'Số lượng sinh viên',
                        data: Object.keys(statsMonHoc).length > 0 ? Object.values(statsMonHoc) : [0],
                        backgroundColor: '#2563EB'
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
            });
        }
    } catch(e) {}
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (isSinhVienPage()) {
            napDuLieuBoLoc();
            layDanhSachSinhVien(1);
        }
    }, 400);
});
</script>`;

    html = html.replace('</body>', `${cleanMasterScript}\n</body>`);
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã phân lập dữ liệu thành công! Trang Giảng viên sẽ trả về đúng bảng Giảng viên!');
}
