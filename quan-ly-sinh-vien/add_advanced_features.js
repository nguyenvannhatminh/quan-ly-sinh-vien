const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Thêm bộ nút công cụ 4 món chuẩn đét: Tải lại, Tải Mẫu Excel, Nhập Excel, Xuất Excel
    const fourBtnGroup = `
    <button type="button" class="btn btn-primary" onclick="reloadSinhVienVisual()">🔄 Tải lại</button>
    <button type="button" class="btn btn-secondary" onclick="taiFileExcelMau()" style="background-color: #0D9488; border-color: #0D9488; color: #ffffff; margin-left: 8px;">📄 Tải Mẫu Excel</button>
    <button type="button" class="btn btn-warning" onclick="document.getElementById('excelFileInput').click()" style="background-color: #F59E0B; border-color: #F59E0B; color: #ffffff; margin-left: 8px; font-weight: 500;">📥 Nhập Excel</button>
    <button type="button" class="btn btn-success" onclick="xuatExcelSinhVien()" style="background-color: #10B981; border-color: #10B981; color: #ffffff; margin-left: 8px;">📥 Xuất Excel</button>
    <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">`;

    if (html.includes('reloadSinhVienVisual()')) {
        // Thay thế cụm nút cũ bằng cụm 4 nút mới
        html = html.replace(/<button[^>]*onclick="reloadSinhVienVisual\(\)"[\s\S]*?<input[^>]*id="excelFileInput"[^>]*>/gi, fourBtnGroup);
    }

    // 2. Thêm Ô Lọc CVHT và Lọc Môn học cạnh ô Tìm kiếm
    const searchAndFilterHtml = `
    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
        <input type="text" id="timKiemInput" class="form-control" placeholder="🔍 Tìm kiếm sinh viên..." oninput="xuLyLocNangCao()" style="max-width: 200px;">
        <select id="filterTutor" class="form-select" onchange="xuLyLocNangCao()" style="max-width: 170px;">
            <option value="">-- Tất cả CVHT --</option>
        </select>
        <select id="filterSubject" class="form-select" onchange="xuLyLocNangCao()" style="max-width: 170px;">
            <option value="">-- Tất cả Môn học --</option>
        </select>
    </div>`;

    // Thay thế ô tìm kiếm đơn lẻ bằng cụm Tìm kiếm + Lọc nâng cao
    html = html.replace(/<input[^>]*placeholder=".*?Tìm kiếm sinh viên.*?"[^>]*>/gi, searchAndFilterHtml);

    // 3. Thêm script xử lý Lọc nâng cao & Tải file mẫu Excel
    const newFeaturesScript = `
<script id="advanced-features-script">
// Tải file mẫu Excel chuẩn ngay từ trình duyệt
function taiFileExcelMau() {
    if (typeof XLSX === 'undefined') {
        alert('⚠️ Thư viện XLSX chưa tải xong, vui lòng chờ trong giây lát!');
        return;
    }
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

// Nạp danh sách CVHT và Môn học vào các thẻ Select Lọc
async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const tutors = await tutorRes.json();
            const selectTutor = document.getElementById('filterTutor');
            if (selectTutor) {
                selectTutor.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + 
                    tutors.map(t => \`<option value="\${t.name}">\${t.name}</option>\`).join('');
            }
        }
        if (subjectRes.ok) {
            const subjects = await subjectRes.json();
            const selectSubject = document.getElementById('filterSubject');
            if (selectSubject) {
                selectSubject.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + 
                    subjects.map(s => \`<option value="\${s.name}">\${s.name}</option>\`).join('');
            }
        }
    } catch(e) { console.error('Lỗi nạp bộ lọc:', e); }
}

// Hàm lọc dữ liệu tức thì trên giao diện bảng
function xuLyLocNangCao() {
    const searchVal = (document.getElementById('timKiemInput')?.value || '').toLowerCase().trim();
    const tutorVal = (document.getElementById('filterTutor')?.value || '').toLowerCase();
    const subjectVal = (document.getElementById('filterSubject')?.value || '').toLowerCase();

    const rows = document.querySelectorAll('table tbody tr');
    rows.forEach(row => {
        if (row.children.length < 5) return; // Bỏ qua hàng thông báo
        const nameText = row.children[1]?.innerText.toLowerCase() || '';
        const emailText = row.children[2]?.innerText.toLowerCase() || '';
        const tutorText = row.children[3]?.innerText.toLowerCase() || '';
        const subjectText = row.children[4]?.innerText.toLowerCase() || '';

        const matchSearch = !searchVal || nameText.includes(searchVal) || emailText.includes(searchVal);
        const matchTutor = !tutorVal || tutorText.includes(tutorVal);
        const matchSubject = !subjectVal || subjectText.includes(subjectVal);

        if (matchSearch && matchTutor && matchSubject) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Gọi nạp dữ liệu lọc ngay khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(napDuLieuBoLoc, 500);
});
</script>`;

    // Chèn script trước </body>
    html = html.replace(/<script id="advanced-features-script">[\s\S]*?<\/script>/gi, '');
    html = html.replace('</body>', `${newFeaturesScript}\n</body>`);

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã thêm Nút Tải Mẫu Excel và Bộ Lọc Nâng Cao thành công!');
} else {
    console.log('❌ Không tìm thấy public/index.html');
}
