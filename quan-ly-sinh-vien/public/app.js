// Danh sách dữ liệu mẫu ban đầu
let students = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'nva@karl.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' }
];

// Biến toàn cục để biết đang Thêm mới (-1) hay Sửa (>= 0)
let editIndex = -1;

// Đổi format ngày sinh từ YYYY-MM-DD sang DD/MM/YYYY
function formatDate(dateString) {
    if(!dateString) return '';
    const parts = dateString.split('-');
    if(parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Hàm hiển thị danh sách sinh viên
function renderStudents() {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;

    tbody.innerHTML = '';

    students.forEach((sv, index) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #334155';
        tr.innerHTML = `
            <td style="padding: 12px; text-align: center;"><input type="checkbox"></td>
            <td style="padding: 12px; font-weight: bold; color: #60a5fa;">${sv.maSV}</td>
            <td style="padding: 12px; font-weight: bold;">${sv.hoTen}</td>
            <td style="padding: 12px;">${sv.gioiTinh}</td>
            <td style="padding: 12px;">${formatDate(sv.ngaySinh)}</td>
            <td style="padding: 12px;">${sv.lop}</td>
            <td style="padding: 12px;">
                <span style="background: #064e3b; color: #34d399; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${sv.trangThai || 'Đang học'}
                </span>
            </td>
            <td style="padding: 12px; text-align: right;">
                <button onclick="editStudent(${index})" style="background: #f59e0b; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Sửa</button>
                <button onclick="deleteStudent(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render danh sách ban đầu
    renderStudents();

    // 2. Mở Modal Thêm Sinh Viên
    const btnThem = document.getElementById('btnThemSV');
    if(btnThem) {
        btnThem.onclick = () => {
            editIndex = -1; // Reset về trạng thái Thêm Mới
            document.getElementById('formSinhVien').reset();
            document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
            document.getElementById('modalSinhVien').style.display = 'flex';
        };
    }

    // 3. Xử lý Form Submit (Cho cả Thêm và Sửa)
    const form = document.getElementById('formSinhVien');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentData = {
                maSV: document.getElementById('maSV').value,
                hoTen: document.getElementById('hoTen').value,
                gioiTinh: document.getElementById('gioiTinh').value,
                ngaySinh: document.getElementById('ngaySinh').value,
                email: document.getElementById('email').value,
                lop: document.getElementById('lop').value,
                // Nếu đang sửa thì giữ nguyên trạng thái cũ, nếu thêm mới thì gán 'Đang học'
                trangThai: editIndex === -1 ? 'Đang học' : students[editIndex].trangThai 
            };

            if (editIndex === -1) {
                // Đẩy vào mảng nếu là Thêm mới
                students.push(studentData);
            } else {
                // Ghi đè dữ liệu cũ nếu là Sửa
                students[editIndex] = studentData;
            }

            renderStudents();
            document.getElementById('modalSinhVien').style.display = 'none';
        });
    }
});

// Hàm Xóa
function deleteStudent(index) {
    if (confirm(`Bro có chắc muốn xóa sinh viên ${students[index].hoTen}?`)) {
        students.splice(index, 1);
        renderStudents();
    }
}

// Hàm Sửa (Đẩy data cũ lên Form)
function editStudent(index) {
    editIndex = index; // Ghi nhớ vị trí đang sửa
    const sv = students[index];

    // Đổ dữ liệu cũ vào các ô input
    document.getElementById('maSV').value = sv.maSV;
    document.getElementById('hoTen').value = sv.hoTen;
    document.getElementById('gioiTinh').value = sv.gioiTinh;
    document.getElementById('ngaySinh').value = sv.ngaySinh;
    document.getElementById('email').value = sv.email;
    document.getElementById('lop').value = sv.lop;

    // Đổi tiêu đề Form và hiện Popup
    document.getElementById('modalTitle').innerText = '✏️ Cập nhật thông tin Sinh Viên';
    document.getElementById('modalSinhVien').style.display = 'flex';
}