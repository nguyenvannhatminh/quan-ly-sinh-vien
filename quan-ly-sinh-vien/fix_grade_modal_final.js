const fs = require('fs');
const path = './public/index.html';

if (fs.existsSync(path)) {
    let html = fs.readFileSync(path, 'utf8');

    // 1. Dọn dẹp Modal & Script cũ nếu có
    html = html.replace(/<!-- === MODAL NHẬP ĐIỂM SỐ[\s\S]*?<!-- ========================================== -->/g, '');
    html = html.replace(/<div id="modalDiem"[\s\S]*?<\/div>\s*<\/div>/g, '');
    html = html.replace(/\/\/ --- LOGIC XỬ LÝ NHẬP ĐIỂM FRONTEND ---[\s\S]*?async function submitGrades\(\)[\s\S]*?}\s*}/g, '');

    // 2. Tạo Modal mới xịn đét, bọc style siêu ưu tiên
    const newModalHTML = `
    <!-- === MODAL NHẬP ĐIỂM SỐ (GRADE ENTRY) === -->
    <div id="modalDiem" onclick="if(event.target===this) closeModalGrade()" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); z-index:999999; justify-content:center; align-items:center;">
      <div onclick="event.stopPropagation()" style="background:#ffffff !important; color:#0f172a !important; padding:1.75rem; border-radius:16px; width:480px; max-width:92%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); font-family: 'Segoe UI', system-ui, sans-serif; position:relative; z-index:1000000;">
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #E2E8F0; padding-bottom:0.75rem;">
          <h3 style="margin:0; color:#0F172A !important; font-size:1.2rem; font-weight:700; display:flex; align-items:center; gap:0.5rem;">
            📝 Nhập Điểm & Xếp Loại
          </h3>
          <button type="button" onclick="closeModalGrade()" style="background:none; border:none; font-size:1.5rem; color:#64748B; cursor:pointer; padding:0 0.5rem;">✕</button>
        </div>

        <div id="studentNameGrade" style="font-weight:600; color:#1E40AF !important; background:#EFF6FF !important; padding:0.75rem; border-radius:8px; margin-bottom:1.25rem; font-size:0.95rem; border:1px solid #BFDBFE;"></div>
        <input type="hidden" id="currentGradeStudentId" />
        
        <div id="gradeInputsContainer" style="max-height:300px; overflow-y:auto; margin-bottom:1.25rem; padding-right:5px;">
          <!-- Các ô nhập điểm sẽ được render vào đây -->
        </div>

        <div style="display:flex; justify-content:flex-end; gap:0.75rem; border-top:1px solid #E2E8F0; padding-top:1rem;">
          <button type="button" onclick="closeModalGrade()" style="padding:0.6rem 1.2rem; border:1px solid #CBD5E1; background:#F8FAFC !important; color:#475569 !important; border-radius:8px; cursor:pointer; font-weight:600;">Hủy</button>
          <button type="button" onclick="submitGrades()" style="padding:0.6rem 1.2rem; background:#2563EB !important; color:#ffffff !important; border:none; border-radius:8px; cursor:pointer; font-weight:600; box-shadow:0 2px 4px rgba(37,99,235,0.3);">💾 Lưu Điểm Số</button>
        </div>
      </div>
    </div>
    <!-- ========================================== -->`;

    // 3. Logic JS hoàn chỉnh
    const newModalScript = `
    <script>
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
            document.getElementById('studentNameGrade').innerText = '👤 Sinh viên: ' + student.name + ' (MSSV: ' + student.SID + ')';
            
            const container = document.getElementById('gradeInputsContainer');
            container.innerHTML = '';

            if (!student.subjects || student.subjects.length === 0) {
                container.innerHTML = '<p style="color:#64748B; font-style:italic; text-align:center; padding:1rem;">⚠️ Sinh viên này chưa đăng ký môn học nào.</p>';
            } else {
                const currentScores = student.diemSo || {};
                student.subjects.forEach((sub) => {
                    const scoreVal = (currentScores[sub.SubID] !== undefined && currentScores[sub.SubID] !== null) ? currentScores[sub.SubID] : '';
                    const div = document.createElement('div');
                    div.style.marginBottom = '1rem';
                    div.innerHTML = \`
                        <label style="display:block; font-size:0.875rem; font-weight:600; color:#334155 !important; margin-bottom:0.35rem;">
                            📖 \${sub.name} <span style="color:#64748B !important; font-weight:normal;">(Mã: \${sub.SubID})</span>
                        </label>
                        <input type="number" step="0.1" min="0" max="10" 
                               class="score-input" data-subid="\${sub.SubID}" value="\${scoreVal}" 
                               placeholder="Nhập điểm (0.0 - 10.0)" 
                               onfocus="this.select()"
                               style="width:100%; padding:0.65rem 0.85rem; border:2px solid #94A3B8; border-radius:8px; font-size:1rem; color:#0F172A !important; background-color:#FFFFFF !important; box-sizing:border-box; outline:none;" />
                    \`;
                    container.appendChild(div);
                });
            }

            document.getElementById('modalDiem').style.display = 'flex';

            // Tự động focus vào ô nhập điểm đầu tiên
            setTimeout(() => {
                const firstInput = container.querySelector('.score-input');
                if (firstInput) firstInput.focus();
            }, 150);

        } catch (err) {
            console.error('Lỗi khi mở modal nhập điểm:', err);
            alert('Có lỗi xảy ra khi tải dữ liệu sinh viên!');
        }
    }

    function closeModalGrade() {
        document.getElementById('modalDiem').style.display = 'none';
    }

    async function submitGrades() {
        const studentId = document.getElementById('currentGradeStudentId').value;
        const inputs = document.querySelectorAll('.score-input');
        const diemSo = {};
        let isValid = true;

        inputs.forEach(input => {
            const subId = input.getAttribute('data-subid');
            const val = input.value.trim();
            if (val !== '') {
                const score = parseFloat(val);
                if (isNaN(score) || score < 0 || score > 10) {
                    isValid = false;
                } else {
                    diemSo[subId] = score;
                }
            }
        });

        if (!isValid) {
            alert('⚠️ Điểm số không hợp lệ! Tất cả điểm phải nằm trong khoảng từ 0.0 đến 10.0.');
            return;
        }

        try {
            const res = await fetch('/sinh-vien/' + studentId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diemSo })
            });

            if (res.ok) {
                alert('🎉 Đã cập nhật điểm số và tự động xếp loại thành công!');
                closeModalGrade();
                if (typeof loadSinhVienList === 'function') loadSinhVienList();
                if (typeof updateDashboardStats === 'function') updateDashboardStats();
            } else {
                const errData = await res.json();
                alert('❌ ' + (errData.message || 'Không thể lưu điểm số!'));
            }
        } catch (err) {
            console.error('Lỗi khi gửi dữ liệu điểm:', err);
            alert('❌ Lỗi kết nối đến server!');
        }
    }
    </script>
    `;

    html = html.replace('</body>', `${newModalHTML}\n${newModalScript}\n</body>`);

    fs.writeFileSync(path, html);
    console.log('🚀 [SUCCESS] Đã rebuild lại Modal Nhập Điểm cực kỳ chuẩn chỉ!');
} else {
    console.log('❌ Không tìm thấy public/index.html');
}
