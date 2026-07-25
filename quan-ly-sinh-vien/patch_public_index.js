const fs = require('fs');
const filePath = './public/index.html';

if (!fs.existsSync(filePath)) {
    console.log('❌ Không tìm thấy file ./public/index.html');
    process.exit(1);
}

let html = fs.readFileSync(filePath, 'utf8');

// 1. CHÈN HTML CỦA MODAL SỬA & MODAL NHẬP ĐIỂM (Nếu chưa có)
const modalsHtml = `
<!-- ================= MODAL SỬA SINH VIÊN ================= -->
<div id="customEditModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999; align-items:center; justify-content:center;">
  <div style="background:#1e293b; color:#fff; padding:24px; border-radius:12px; width:420px; max-width:90%; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h3 style="margin-top:0; color:#38bdf8; display:flex; align-items:center; gap:8px;">✏️ Sửa Thông Tin Sinh Viên</h3>
    <input type="hidden" id="editSvId">
    <div style="margin-bottom:14px;">
      <label style="display:block; margin-bottom:4px; font-size:14px; color:#94a3b8;">Họ và Tên:</label>
      <input type="text" id="editSvName" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; box-sizing:border-box;">
    </div>
    <div style="margin-bottom:14px;">
      <label style="display:block; margin-bottom:4px; font-size:14px; color:#94a3b8;">Email:</label>
      <input type="email" id="editSvEmail" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; box-sizing:border-box;">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
      <button onclick="closeCustomEditModal()" style="padding:8px 16px; background:#64748b; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Hủy</button>
      <button onclick="saveCustomEditStudent()" style="padding:8px 16px; background:#2563eb; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">💾 Lưu thay đổi</button>
    </div>
  </div>
</div>

<!-- ================= MODAL NHẬP ĐIỂM ================= -->
<div id="customGradeModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); z-index:9999; align-items:center; justify-content:center;">
  <div style="background:#1e293b; color:#fff; padding:24px; border-radius:12px; width:380px; max-width:90%; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <h3 style="margin-top:0; color:#0284c7; display:flex; align-items:center; gap:8px;">📝 Nhập Điểm Sinh Viên</h3>
    <input type="hidden" id="gradeSvId">
    <div style="margin-bottom:14px;">
      <label id="gradeSvNameLabel" style="display:block; margin-bottom:8px; font-weight:bold; color:#e2e8f0;">Sinh viên:</label>
      <input type="number" step="0.1" min="0" max="10" id="gradeInput" placeholder="Nhập điểm (0.0 - 10.0)" style="width:100%; padding:10px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:6px; box-sizing:border-box; font-size:16px;">
    </div>
    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
      <button onclick="closeCustomGradeModal()" style="padding:8px 16px; background:#64748b; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">Hủy</button>
      <button onclick="saveCustomGrade()" style="padding:8px 16px; background:#0284c7; color:#fff; border:none; border-radius:6px; cursor:pointer; font-weight:600;">✅ Lưu điểm</button>
    </div>
  </div>
</div>
`;

if (!html.includes('id="customEditModal"')) {
    html = html.replace('</body>', modalsHtml + '\n</body>');
}

// 2. CHÈN SCRIPT XỬ LÝ SỰ KIỆN (SỬA, NHẬP ĐIỂM, PHÂN TRANG)
const logicScript = `
<script>
// --- HÀM SỬA SINH VIÊN ---
window.openEditModal = window.editStudent = async function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    try {
        const res = await fetch('/sinh-vien/' + id);
        if (!res.ok) throw new Error('Không lấy được thông tin sinh viên');
        const sv = await res.json();
        
        document.getElementById('editSvId').value = sv.SID || id;
        document.getElementById('editSvName').value = sv.name || '';
        document.getElementById('editSvEmail').value = sv.email || '';
        document.getElementById('customEditModal').style.display = 'flex';
    } catch(e) {
        alert('Lỗi: ' + e.message);
    }
};

window.closeCustomEditModal = function() {
    document.getElementById('customEditModal').style.display = 'none';
};

window.saveCustomEditStudent = async function() {
    const id = document.getElementById('editSvId').value;
    const name = document.getElementById('editSvName').value;
    const email = document.getElementById('editSvEmail').value;
    
    try {
        const res = await fetch('/sinh-vien/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        if (res.ok) {
            alert('Cập nhật thông tin sinh viên thành công!');
            closeCustomEditModal();
            location.reload();
        } else {
            alert('Cập nhật thất bại!');
        }
    } catch(e) {
        alert('Lỗi kết nối API: ' + e.message);
    }
};

// --- HÀM NHẬP ĐIỂM ---
window.openGradeModal = async function(id) {
    if (!id) return alert('Không tìm thấy Mã SV!');
    document.getElementById('gradeSvId').value = id;
    document.getElementById('gradeInput').value = '';
    document.getElementById('gradeSvNameLabel').innerText = 'Mã SV: ' + id;

    try {
        const res = await fetch('/sinh-vien/' + id);
        if (res.ok) {
            const sv = await res.json();
            document.getElementById('gradeSvNameLabel').innerText = 'Sinh viên: ' + (sv.name || id);
            if (sv.diemSo !== undefined && sv.diemSo !== null) {
                document.getElementById('gradeInput').value = sv.diemSo;
            }
        }
    } catch(e) {}
    
    document.getElementById('customGradeModal').style.display = 'flex';
};

window.closeCustomGradeModal = function() {
    document.getElementById('customGradeModal').style.display = 'none';
};

window.saveCustomGrade = async function() {
    const id = document.getElementById('gradeSvId').value;
    const diemSo = document.getElementById('gradeInput').value;
    if (diemSo === '') return alert('Vui lòng nhập số điểm!');

    try {
        const res = await fetch('/sinh-vien/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ diemSo: Number(diemSo) })
        });
        if (res.ok) {
            alert('Nhập điểm thành công!');
            closeCustomGradeModal();
            location.reload();
        } else {
            alert('Lỗi nhập điểm!');
        }
    } catch(e) {
        alert('Lỗi kết nối: ' + e.message);
    }
};

// --- HÀM XỬ LÝ PHÂN TRANG (TRANG 1, 2, 3, TRƯỚC, SAU) ---
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('button, a, .page-link, .btn');
        if (!btn) return;
        
        const text = btn.innerText.trim();
        // Kiểm tra xem nút bấm có phải thuộc khu vực Phân trang không
        if (['1', '2', '3', '4', '5'].includes(text) || text.includes('Trước') || text.includes('Sau')) {
            let url = new URL(window.location.href);
            let currentPage = parseInt(url.searchParams.get('page')) || 1;
            let targetPage = currentPage;

            if (text.includes('Trước')) targetPage = Math.max(1, currentPage - 1);
            else if (text.includes('Sau')) targetPage = currentPage + 1;
            else if (!isNaN(parseInt(text))) targetPage = parseInt(text);

            if (targetPage !== currentPage || !url.searchParams.has('page')) {
                url.searchParams.set('page', targetPage);
                window.location.href = url.toString();
            }
        }
    });
});
</script>
`;

// Xóa script cũ nếu từng gắn và thay bằng bản mới
html = html.replace(/<script id="direct-patch">[\s\S]*?<\/script>/g, '');
html = html.replace('</body>', `<script id="direct-patch">${logicScript}</script>\n</body>`);

fs.writeFileSync(filePath, html, 'utf8');
console.log('🎉 Đã vá trực tiếp file ./public/index.html thành công!');
