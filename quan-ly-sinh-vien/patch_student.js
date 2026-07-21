const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// Khối code chuẩn xử lý trọn gói các sự kiện Form Sinh viên
const studentLogic = `
        // 1. HÀM HỦY CHẾ ĐỘ SỬA (RESET FORM)
        window.huyCheDoSua = function() {
            isEditing = false;
            editingStudentId = null;
            const form = document.getElementById('formSinhVien');
            if (form) {
                form.reset();
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => cb.checked = false);
            }
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.innerText = 'Lưu Hồ sơ';
                submitBtn.className = 'btn btn-success';
            }
            const cancelBtn = document.getElementById('cancelBtn');
            if (cancelBtn) cancelBtn.style.display = 'none';
        };

        // 2. HÀM KÍCH HOẠT CHẾ ĐỘ SỬA (ĐẨY DỮ LIỆU LÊN FORM)
        window.kichHoatCheDoSua = function(id) {
            const sv = listSinhVienBoNhoDem.find(x => x.SID === id);
            if (!sv) return;
            isEditing = true;
            editingStudentId = id;
            
            const form = document.getElementById('formSinhVien');
            if (!form) return;
            
            form.name.value = sv.name || '';
            form.email.value = sv.email || '';
            form.tutorId.value = sv.tutorId || (sv.tutor ? sv.tutor.TID : '');

            // Kích hoạt các checkbox môn học mà sinh viên này đang đăng ký
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                const subId = parseInt(cb.value);
                cb.checked = sv.subjects ? sv.subjects.some(s => s.SubID === subId || s.id === subId) : false;
            });

            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.innerText = 'Cập nhật';
                submitBtn.className = 'btn btn-warning';
            }
            const cancelBtn = document.getElementById('cancelBtn');
            if (cancelBtn) cancelBtn.style.display = 'inline-block';
        };

        // 3. HÀM XỬ LÝ SUBMIT (THÊM MỚI HOẶC CẬP NHẬT)
        window.xuLySubmitSinhVien = async function(event) {
            event.preventDefault();
            const form = event.target;
            const name = form.name.value;
            const email = form.email.value;
            const tutorId = form.tutorId.value ? parseInt(form.tutorId.value) : null;
            
            // Gom toàn bộ ID môn học được tích chọn
            const checkedBoxes = form.querySelectorAll('input[type="checkbox"]:checked');
            const subjectIds = Array.from(checkedBoxes).map(cb => parseInt(cb.value));

            const bodyData = { name, email, tutorId, subjectIds };
            
            const url = isEditing ? '/sinh-vien/' + editingStudentId : '/sinh-vien';
            const method = isEditing ? 'PATCH' : 'POST';

            try {
                const res = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bodyData)
                });
                if (res.ok) {
                    window.huyCheDoSua();
                    if (typeof layDanhSachSinhVien === 'function') layDanhSachSinhVien(currentPage);
                    if (typeof taiDuLieuFormSinhVien === 'function') taiDuLieuFormSinhVien();
                } else {
                    const errData = await res.json();
                    alert('Lỗi: ' + (errData.message || 'Không thể xử lý yêu cầu'));
                }
            } catch (err) {
                alert('Lỗi kết nối mạng: ' + err.message);
            }
        };
`;

// Chèn an toàn vào cuối thẻ script cuối cùng của file
const endIndex = html.lastIndexOf('</script>');
if (endIndex !== -1) {
    html = html.substring(0, endIndex) + studentLogic + html.substring(endIndex);
    fs.writeFileSync('./public/index.html', html);
    console.log('🎉 [XỬ LÝ THÀNH CÔNG]: Khối xử lý Sinh viên (CRUD Student) đã được tích hợp hoàn chỉnh!');
} else {
    console.log('❌ Thất bại: Không tìm thấy thẻ đóng script.');
}
