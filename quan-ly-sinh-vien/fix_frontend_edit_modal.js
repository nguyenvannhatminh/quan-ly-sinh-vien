const fs = require('fs');
const path = require('path');

// Tìm các file giao diện html/js trong thư mục public, views hoặc src
function findFrontendFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') {
                findFrontendFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ejs')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const files = findFrontendFiles('.');
let targetHtmlFile = files.find(f => f.includes('public') && f.endsWith('.html')) || files.find(f => f.endsWith('index.html')) || files.find(f => f.endsWith('.html'));

if (targetHtmlFile) {
    console.log(`🎯 Tìm thấy file giao diện: ${targetHtmlFile}`);
    let content = fs.readFileSync(targetHtmlFile, 'utf8');

    // 1. Thêm Modal Sửa Sinh Viên vào HTML nếu chưa có
    const editModalHtml = `
<!-- Modal Sửa Sinh Viên -->
<div id="editStudentModal" class="modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;">
  <div style="background:#1e293b; color:#fff; padding:24px; border-radius:12px; width:450px; max-width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.5);">
    <h3 style="margin-top:0; color:#38bdf8; font-size:18px;">✏️ Cập nhật Hồ sơ Sinh viên</h3>
    <form id="editStudentForm" style="display:flex; flex-direction:column; gap:12px; margin-top:16px;">
      <input type="hidden" id="editStudentId" />
      <div>
        <label style="font-size:13px; color:#94a3b8;">Họ và Tên (*)</label>
        <input type="text" id="editStudentName" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #334155; background:#0f172a; color:#fff; margin-top:4px;" />
      </div>
      <div>
        <label style="font-size:13px; color:#94a3b8;">Email cá nhân</label>
        <input type="email" id="editStudentEmail" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #334155; background:#0f172a; color:#fff; margin-top:4px;" />
      </div>
      <div>
        <label style="font-size:13px; color:#94a3b8;">Giảng viên Cố vấn (CVHT)</label>
        <select id="editStudentTutor" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #334155; background:#0f172a; color:#fff; margin-top:4px;"></select>
      </div>
      <div>
        <label style="font-size:13px; color:#94a3b8; display:block; margin-bottom:6px;">Môn học đăng ký</label>
        <div id="editStudentSubjects" style="display:flex; flex-wrap:wrap; gap:10px; max-height:120px; overflow-y:auto; padding:8px; border:1px solid #334155; border-radius:6px; background:#0f172a;"></div>
      </div>
      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:12px;">
        <button type="button" onclick="closeEditModal()" style="padding:8px 16px; border-radius:6px; border:none; background:#475569; color:#fff; cursor:pointer;">Hủy</button>
        <button type="submit" style="padding:8px 16px; border-radius:6px; border:none; background:#10b981; color:#fff; font-weight:bold; cursor:pointer;">Lưu thay đổi</button>
      </div>
    </form>
  </div>
</div>
`;

    if (!content.includes('editStudentModal')) {
        content = content.replace('</body>', editModalHtml + '\n</body>');
    }

    // 2. Thêm script xử lý mở Modal và gọi API PATCH
    const editScript = `
<script>
window.openEditModal = async function(id) {
  try {
    const res = await fetch('/sinh-vien/' + id);
    let sv = null;
    if (res.ok) {
      sv = await res.json();
    } else {
      // Nếu API get by id chưa có, lấy từ hàng hiện tại trên bảng
      alert('Đang tải thông tin sinh viên mã ' + id);
      return;
    }

    document.getElementById('editStudentId').value = sv.SID || id;
    document.getElementById('editStudentName').value = sv.name || '';
    document.getElementById('editStudentEmail').value = sv.email || '';

    // Load danh sách Cố vấn
    const tutorSelect = document.getElementById('editStudentTutor');
    tutorSelect.innerHTML = '<option value="">-- Không có --</option>';
    try {
      const tutorRes = await fetch('/tutor');
      if (tutorRes.ok) {
        const tutors = await tutorRes.json();
        const currentTutorId = sv.tutor ? (sv.tutor.TID || sv.tutor.id) : sv.tutorId;
        tutors.forEach(t => {
          const tid = t.TID || t.id;
          const selected = currentTutorId == tid ? 'selected' : '';
          tutorSelect.innerHTML += \`<option value="\${tid}" \${selected}>\${t.name}</option>\`;
        });
      }
    } catch(e){}

    // Load danh sách Môn học
    const subDiv = document.getElementById('editStudentSubjects');
    subDiv.innerHTML = '';
    try {
      const subRes = await fetch('/subject');
      if (subRes.ok) {
        const subjects = await subRes.json();
        const registeredIds = (sv.subjects || []).map(s => s.SubID || s.id);
        subjects.forEach(s => {
          const sid = s.SubID || s.id;
          const checked = registeredIds.includes(sid) ? 'checked' : '';
          subDiv.innerHTML += \`<label style="font-size:12px; cursor:pointer;"><input type="checkbox" name="editSub" value="\${sid}" \${checked}> \${s.name}</label>\`;
        });
      }
    } catch(e){}

    document.getElementById('editStudentModal').style.display = 'flex';
  } catch(err) {
    console.error('Lỗi mở modal:', err);
  }
};

window.closeEditModal = function() {
  document.getElementById('editStudentModal').style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('editStudentForm');
  if (editForm) {
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('editStudentId').value;
      const name = document.getElementById('editStudentName').value;
      const email = document.getElementById('editStudentEmail').value;
      const tutorId = document.getElementById('editStudentTutor').value || null;
      
      const subjectCheckboxes = document.querySelectorAll('input[name="editSub"]:checked');
      const subjectIds = Array.from(subjectCheckboxes).map(cb => Number(cb.value));

      try {
        const res = await fetch('/sinh-vien/' + id, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, tutorId, subjectIds })
        });

        if (res.ok) {
          alert('✅ Cập nhật sinh viên thành công!');
          closeEditModal();
          if (typeof loadData === 'function') loadData();
          else location.reload();
        } else {
          alert('❌ Có lỗi xảy ra khi cập nhật!');
        }
      } catch(err) {
        alert('❌ Lỗi kết nối máy chủ!');
      }
    });
  }
});
</script>
`;

    if (!content.includes('openEditModal')) {
        content = content.replace('</body>', editScript + '\n</body>');
    }

    fs.writeFileSync(targetHtmlFile, content, 'utf8');
    console.log('✅ Đã tích hợp thành công Modal & Logic Sửa Sinh Viên vào Frontend!');
} else {
    console.log('❌ Không tìm thấy file HTML giao diện chính.');
}
