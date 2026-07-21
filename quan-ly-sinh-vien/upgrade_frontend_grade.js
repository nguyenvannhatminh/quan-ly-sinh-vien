const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Tạo Modal Nhập Điểm Số xịn mịn
    const modalGradeHTML = `
    <!-- === MODAL NHẬP ĐIỂM SỐ (GRADE ENTRY) === -->
    <div id="modalDiem" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index:9999; justify-content:center; align-items:center;">
      <div style="background:white; padding:1.75rem; border-radius:16px; width:460px; max-width:92%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); font-family: 'Segoe UI', system-ui, sans-serif;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #F1F5F9; padding-bottom:0.75rem;">
          <h3 style="margin:0; color:#0F172A; font-size:1.2rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
            📝 Nhập Điểm & Xếp Loại
          </h3>
          <button onclick="closeModalGrade()" style="background:none; border:none; font-size:1.25rem; color:#64748B; cursor:pointer;">✕</button>
        </div>

        <div id="studentNameGrade" style="font-weight:600; color:#2563EB; background:#EFF6FF; padding:0.6rem 0.8rem; border-radius:8px; margin-bottom:1.25rem; font-size:0.95rem;"></div>
        <input type="hidden" id="currentGradeStudentId" />
        
        <div id="gradeInputsContainer" style="max-height:280px; overflow-y:auto; margin-bottom:1.25rem; padding-right:5px;">
          <!-- Danh sách ô nhập điểm từng môn sẽ được sinh tự động tại đây -->
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid #F1F5F9; padding-top:1rem;">
          <button onclick="closeModalGrade()" style="padding:0.6rem 1.2rem; border:1px solid #CBD5E1; background:white; color:#475569; border-radius:8px; cursor:pointer; font-weight:600;">Hủy</button>
          <button onclick="submitGrades()" style="padding:0.6rem 1.2rem; background:#2563EB; color:white; border:none; border-radius:8px; cursor:pointer; font-weight:600; box-shadow:0 2px 4px rgba(37,99,235,0.2);">💾 Lưu Điểm Số</button>
        </div>
      </div>
    </div>
    <!-- ========================================== -->`;

    // Chèn Modal vào trước </body>
    if (!html.includes('id="modalDiem"')) {
        html = html.replace('</body>', `${modalGradeHTML}\n</body>`);
    }

    // 2. Chèn logic xử lý Modal & gọi API Cập nhật điểm
    const gradeScript = `
    // --- LOGIC XỬ LÝ NHẬP ĐIỂM FRONTEND ---
    async function openGradeModal(studentId) {
        try {
            const res = await fetch('/sinh-vien?page=1&limit=100');
            const result = await res.json();
            const student = result.data ? result.data.find(s => s.SID === studentId) : null;
            
            if (!student) {
                alert('Không tìm thấy thông tin sinh viên!');
                return;
            }

            document.getElementById('currentGradeStudentId').value = student.SID;
            document.getElementById('studentNameGrade').innerText = \`👤 Sinh viên: \${student.name} (MSSV: \${student.SID})\`;
            
            const container = document.getElementById('gradeInputsContainer');
            container.innerHTML = '';

            if (!student.subjects || student.subjects.length === 0) {
                container.innerHTML = '<p style="color:#64748B; font-style:italic; text-align:center; padding:1rem;">⚠️ Sinh viên này chưa đăng ký môn học nào.</p>';
            } else {
                const currentScores = student.diemSo || {};
                student.subjects.forEach(sub => {
                    const scoreVal = currentScores[sub.SubID] !== undefined ? currentScores[sub.SubID] : '';
                    const div = document.createElement('div');
                    div.style.marginBottom = '1rem';
                    div.innerHTML = \`
                        <label style="display:block; font-size:0.875rem; font-weight:600; color:#334155; margin-bottom:0.35rem;">
                            📖 \${sub.name} <span style="color:#94A3B8; font-weight:normal;">(Mã: \${sub.SubID})</span>
                        </label>
                        <input type="number" step="0.1" min="0" max="10" 
                               class="score-input" data-subid="\${sub.SubID}" value="\${scoreVal}" 
                               placeholder="Nhập điểm (0.0 - 10.0)" 
                               style="width:100%; padding:0.55rem 0.75rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.95rem; box-sizing:border-box;" />
                    \`;
                    container.appendChild(div);
                });
            }

            document.getElementById('modalDiem').style.display = 'flex';
        } catch (err) {
            console.error('Lỗi khi mở modal nhập điểm:', err);
        }
    }

    function closeModalGrade() {
        document.getElementById('modalDiem').style.display = 'none';
    }

    async function submitGrades() {
        const studentId = document.getElementById('currentGradeStudentId').value;
        const inputs = document.querySelectorAll('.score-input');
        const diemSo = {};

        inputs.forEach(input => {
            const subId = input.getAttribute('data-subid');
            const val = input.value.trim();
            if (val !== '') {
                diemSo[subId] = parseFloat(val);
            }
        });

        try {
            const res = await fetch('/sinh-vien/' + studentId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diemSo })
            });

            if (res.ok) {
                alert('🎉 Đã cập nhật điểm số và tự động xếp loại thành công!');
                closeModalGrade();
                if (typeof loadSinhVienList === 'function') loadSinhVienList();
                if (typeof updateDashboardStats === 'function') updateDashboardStats();
            } else {
                alert('❌ Không thể lưu điểm số!');
            }
        } catch (err) {
            console.error('Lỗi khi gửi dữ liệu điểm:', err);
        }
    }
    `;

    if (!html.includes('openGradeModal')) {
        html = html.replace('</body>', `<script>\n${gradeScript}\n</script>\n</body>`);
    }

    fs.writeFileSync(filePath, html);
    console.log('🚀 [SUCCESS] Đã tích hợp Modal Nhập Điểm & Logic Xếp Loại vào Frontend!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
