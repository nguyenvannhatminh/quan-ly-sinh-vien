const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Xóa toàn bộ các thẻ script công cụ cũ
    html = html.replace(/<script id=".*?"[\s\S]*?<\/script>/gi, '');

    // 2. Xóa triệt để dải JS bị rò rỉ nằm ngoài thẻ script (chỗ bị lộ ở phân trang)
    html = html.replace(/['"]?\s*;\s*const blob[\s\S]*?(?=<script|<\/body>|<\/html>|$)/gi, '');
    html = html.replace(/eff'\s*\+\s*excelHTML[\s\S]*?(?=<script|<\/body>|<\/html>|$)/gi, '');
    html = html.replace(/URL\.revokeObjectURL[\s\S]*?(?=<script|<\/body>|<\/html>|$)/gi, '');
    html = html.replace(/async function xuLyImportExcel[\s\S]*?(?=<script|<\/body>|<\/html>|$)/gi, '');

    // Cắt bỏ phần dư thừa sau thẻ </html> nếu có
    if (html.includes('</html>')) {
        const parts = html.split('</html>');
        html = parts[0] + '</html>';
    }

    // 3. Đảm bảo nhúng thư viện XLSX
    if (!html.includes('xlsx.full.min.js')) {
        html = html.replace('</head>', '  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>\n</head>');
    }

    // 4. Đảm bảo có input chọn file ẩn
    if (!html.includes('id="excelFileInput"')) {
        html = html.replace('</body>', '  <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">\n</body>');
    }

    // 5. Đóng gói duy nhất 1 thẻ <script> Master chuẩn đét
    const masterScript = `
<script id="karl-system-master">
// 1. TẢI LẠI BẢNG
async function reloadSinhVienVisual() {
    const tbody = document.querySelector('table tbody');
    if (tbody) {
        tbody.style.opacity = '0.3';
        tbody.style.transition = 'opacity 0.2s ease';
        if (typeof layDanhSachSinhVien === 'function') {
            const page = (typeof currentPage !== 'undefined') ? currentPage : 1;
            await layDanhSachSinhVien(page);
        } else if (typeof loadStudents === 'function') {
            await loadStudents();
        } else {
            location.reload();
        }
        setTimeout(() => { if (tbody) tbody.style.opacity = '1'; }, 300);
    } else {
        location.reload();
    }
}

// 2. XUẤT EXCEL
function xuatExcelSinhVien() {
    const table = document.querySelector('table');
    if (!table) { alert('⚠️ Không tìm thấy bảng dữ liệu!'); return; }
    const cloneTable = table.cloneNode(true);
    cloneTable.querySelectorAll('tr').forEach(row => {
        if (row.children.length > 0) row.children[row.children.length - 1].remove();
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

// 3. TẢI FILE MẪU EXCEL
function taiFileExcelMau() {
    if (typeof XLSX === 'undefined') { alert('⚠️ Thư viện XLSX chưa tải xong, vui lòng thử lại!'); return; }
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

// 4. NHẬP EXCEL
async function xuLyImportExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    event.target.value = '';

    if (typeof XLSX === 'undefined') { alert('⚠️ Thư viện XLSX chưa sẵn sàng!'); return; }

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
        } catch(err) {
            console.error(err);
            alert('❌ Lỗi đọc file Excel!');
        }
    };
    reader.readAsArrayBuffer(file);
}

// 5. BỘ LỌC NÂNG CAO
async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const tutors = await tutorRes.json();
            const sel = document.getElementById('filterTutor');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + tutors.map(t => \`<option value="\${t.name}">\${t.name}</option>\`).join('');
        }
        if (subjectRes.ok) {
            const subjects = await subjectRes.json();
            const sel = document.getElementById('filterSubject');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + subjects.map(s => \`<option value="\${s.name}">\${s.name}</option>\`).join('');
        }
    } catch(e) {}
}

function xuLyLocNangCao() {
    const searchVal = (document.getElementById('timKiemInput')?.value || '').toLowerCase().trim();
    const tutorVal = (document.getElementById('filterTutor')?.value || '').toLowerCase();
    const subjectVal = (document.getElementById('filterSubject')?.value || '').toLowerCase();

    document.querySelectorAll('table tbody tr').forEach(row => {
        if (row.children.length < 5) return;
        const nameText = row.children[1]?.innerText.toLowerCase() || '';
        const emailText = row.children[2]?.innerText.toLowerCase() || '';
        const tutorText = row.children[3]?.innerText.toLowerCase() || '';
        const subjectText = row.children[4]?.innerText.toLowerCase() || '';

        const mSearch = !searchVal || nameText.includes(searchVal) || emailText.includes(searchVal);
        const mTutor = !tutorVal || tutorText.includes(tutorVal);
        const mSub = !subjectVal || subjectText.includes(subjectVal);

        row.style.display = (mSearch && mTutor && mSub) ? '' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(napDuLieuBoLoc, 500); });
</script>`;

    html = html.replace('</body>', `${masterScript}\n</body>`);
    fs.writeFileSync(filePath, html);
    console.log('✅ Đã quét sạch 100% rác rò rỉ và dọn dẹp giao diện hoàn hảo!');
}
