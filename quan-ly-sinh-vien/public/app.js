// URL Backend NestJS của dự án
const API_URL = '/students'; // Hoặc đường dẫn API sinh viên của dự án bro

// Khi trang load xong
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mở Modal khi bấm nút Thêm Sinh Viên
    const btnThem = document.querySelector('button:has(span), button') ; // Nút Thêm
    
    // Gán sự kiện mở modal cho nút Thêm Sinh Viên
    window.openModal = function() {
        const modal = document.getElementById('modalSinhVien');
        if (modal) {
            document.getElementById('formSinhVien').reset();
            document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
            modal.style.display = 'flex';
        }
    };

    // Gán sự kiện cho nút Thêm Sinh Viên trên UI
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Thêm Sinh Viên')) {
            btn.onclick = window.openModal;
        }
    });

    // 2. Xử lý submit Form Thêm/Sửa Sinh Viên
    const form = document.getElementById('formSinhVien');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const studentData = {
                maSV: document.getElementById('maSV').value,
                hoTen: document.getElementById('hoTen').value,
                email: document.getElementById('email').value,
                lop: document.getElementById('lop').value,
            };

            console.log('Dữ liệu gửi đi:', studentData);

            // Tạm thời thông báo thành công & đóng modal
            alert(`Đã lưu sinh viên: ${studentData.hoTen} (${studentData.maSV})`);
            document.getElementById('modalSinhVien').style.display = 'none';
        });
    }
});

// Hàm hỗ trợ Xóa Sinh Viên
function deleteStudent(maSV) {
    if (confirm(`Bro có chắc muốn xóa sinh viên ${maSV} không?`)) {
        alert(`Đã xóa thành công ${maSV}!`);
    }
}