const fs = require('fs');
const filePath = './public/index.html';

if (!fs.existsSync(filePath)) {
    console.log('❌ Không tìm thấy file ./public/index.html');
    process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf8');

// 1. DỌN SẠCH TẤT CẢ CODE JS BỊ RÒ RỈ RA NGOÀI THẺ SCRIPT
// Tìm vị trí xuất hiện của dòng chữ 'const blob = new Blob' hoặc 'napDuLieuBoLoc'
const badIndex = html.search(/(?:';\s*)?const blob = new Blob/);

if (badIndex !== -1) {
    // Lùi lại tìm thẻ </script> gần nhất phía trước
    let cutStart = html.lastIndexOf('</script>', badIndex);
    if (cutStart === -1) cutStart = badIndex;
    else cutStart += '</script>'.length;

    // Tìm thẻ </body> phía sau
    let cutEnd = html.indexOf('</body>', badIndex);
    if (cutEnd === -1) cutEnd = html.length;

    // Cắt bỏ hoàn toàn vùng văn bản bị hỏng nằm giữa
    html = html.slice(0, cutStart) + '\n' + html.slice(cutEnd);
    console.log('🧹 Đã cắt bỏ thành công đoạn code JS rò rỉ trên màn hình!');
}

// 2. CHÈN BỘ KỊCH BẢN MASTER SẠCH SẼ & ĐỌC LẠI BỘ LỌC
const masterScript = `
<!-- MASTER SCRIPT FIXED -->
<script>
// --- 1. NẠP DỮ LIỆU BỘ LỌC CVHT & MÔN HỌC ---
async function napDuLieuBoLoc() {
    try {
        const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
        if (tutorRes.ok) {
            const list = await tutorRes.json();
            const sel = document.getElementById('filterTutor');
            const tutorSel = document.getElementById('tutorSelect');
            const data = Array.isArray(list) ? list : (list.data || []);
            const opts = data.map(t => '<option value="' + (t.TID || t.id) + '">' + t.name + '</option>').join('');
            if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + opts;
            if (tutorSel) tutorSel.innerHTML = '<option value="">-- Không có --</option>' + opts;
        }
        if (subjectRes.ok) {
            const list = await subjectRes.json();
            const sel = document.getElementById('filterSubject');
            const data = Array.isArray(list) ? list : (data.data || []);
            if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + data.map(s => '<option value="' + (s.SubID || s.id) + '">' + s.name + '</option>').join('');
        }
    } catch(e) { console.error('Lỗi nạp bộ lọc:', e); }
}

// --- 2. TẢI FILE EXCEL MẪU ---
function taiFileExcelMau() {
    if (typeof XLSX === 'undefined') {
        alert('Thư viện Excel chưa sẵn sàng!');
        return;
    }
    const ws = XLSX.utils.json_to_sheet([{ "Họ và Tên": "Nguyễn Văn A", "Email": "a@gmail.com" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mau_Sinh_Vien");
    XLSX.writeFile(wb, "Mau_Nhap_Sinh_Vien.xlsx");
}

// --- 3. HÀM MỞ MODAL SỬA SINH VIÊN ---
window.openEditModal = window.editStudent = async function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    try {
        const res = await fetch('/sinh-vien/' + id);
        if (!res.ok) throw new Error('Không lấy được thông tin sinh viên');
        const sv = await res.json();
        
        const modal = document.getElementById('customEditModal') || document.getElementById('editModal');
        const idInput = document.getElementById('editSvId') || document.getElementById('editSid');
        const nameInput = document.getElementById('editSvName') || document.getElementById('editName');
        const emailInput = document.getElementById('editSvEmail') || document.getElementById('editEmail');

        if (idInput) idInput.value = sv.SID || id;
        if (nameInput) nameInput.value = sv.name || '';
        if (emailInput) emailInput.value = sv.email || '';

        if (modal) modal.style.display = 'flex';
        else alert('Đã lấy dữ liệu SV ' + (sv.name || id) + '! (Chờ hiển thị Modal)');
    } catch(e) {
        alert('Lỗi: ' + e.message);
    }
};

// --- 4. HÀM MỞ MODAL NHẬP ĐIỂM ---
window.openGradeModal = function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    const modal = document.getElementById('customGradeModal') || document.getElementById('gradeModal');
    const idInput = document.getElementById('gradeSvId');
    if (idInput) idInput.value = id;
    if (modal) modal.style.display = 'flex';
    else alert('Nhập điểm cho Mã SV: ' + id);
};

// --- 5. TỰ ĐỘNG KHỞI TẠO KHI TẢI TRANG ---
document.addEventListener('DOMContentLoaded', () => {
    napDuLieuBoLoc();
    if (typeof layDanhSachSinhVien === 'function') {
        layDanhSachSinhVien(1);
    }

    // Bắt sự kiện chuyển trang (1, 2, 3, Trước, Sau)
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a');
        if (!btn) return;
        const text = btn.innerText.trim();
        if (['1', '2', '3', '4', '5'].includes(text) || text.includes('Trước') || text.includes('Sau')) {
            let page = window.currentPage || 1;
            if (text.includes('Trước')) page = Math.max(1, page - 1);
            else if (text.includes('Sau')) page += 1;
            else if (!isNaN(parseInt(text))) page = parseInt(text);

            if (typeof layDanhSachSinhVien === 'function') {
                window.currentPage = page;
                layDanhSachSinhVien(page);
            }
        }
    });
});
</script>
`;

// Xóa master script cũ nếu có
html = html.replace(/<!-- MASTER SCRIPT FIXED -->[\s\S]*?<\/script>/g, '');

// Ghép lại vào trước </body>
if (html.includes('</body>')) {
    html = html.replace('</body>', masterScript + '\n</body>');
} else {
    html += masterScript;
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('🎉 ĐÃ SỬA TRIỆT ĐỂ! Dọn sạch hoàn toàn code rác trên màn hình!');
