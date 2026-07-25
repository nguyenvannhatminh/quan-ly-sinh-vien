// Danh sách dữ liệu mẫu ban đầu
let students = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', email: 'nva@karl.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' }
];

// Hàm hiển thị danh sách sinh viên ra bảng HTML
function renderStudents() {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;

    // Xóa sạch dòng cũ
    tbody.innerHTML = '';

    // Lặp qua mảng students và tạo từng dòng <tr>
    students.forEach((sv, index) => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #334155';
        tr.innerHTML = `
            <td style="padding: 12px;"><input type="checkbox"></td>
            <td style="padding: 12px; font-weight: bold; color: #60a5fa;">${sv.maSV}</td>
            <td style="padding: 12px; font-weight: bold;">${sv.hoTen}</td>
            <td style="padding: 12px; color: #94a3b8;">${sv.email}</td>
            <td style="padding: 12px;">${sv.lop}</td>
            <td style="padding: 12px;">
                <span style="background: #064e3b; color: #34d399; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                    ${sv.trangThai || 'Đang học'}
                </span>
            </td>
            <td style="padding: 12px;">
                <button onclick="editStudent(${index})" style="background: #f59e0b; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Sửa</button>
                <button onclick="deleteStudent(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Khi trang vừa load xong
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render danh sách ban đầu
    renderStudents();

    // 2. Bắt sự kiện bật Modal cho nút "+ Thêm Sinh Viên"
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Thêm Sinh Viên')) {
            btn.onclick = () => {
                document.getElementById('formSinhVien').reset();
                document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
                document.getElementById('modalSinhVien').style.display = 'flex';
            };
        }
    });

    // 3. Xử lý Form Submit (Thêm sinh viên mới vào mảng và Render lại)
    const form = document.getElementById('formSinhVien');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Lấy dữ liệu từ ô input
            const newSV = {
                maSV: document.getElementById('maSV').value,
                hoTen: document.getElementById('hoTen').value,
                email: document.getElementById('email').value,
                lop: document.getElementById('lop').value,
                trangThai: 'Đang học'
            };

            // Đẩy vào mảng students
            students.push(newSV);

            // Render lại bảng ngay lập tức
            renderStudents();

            // Ẩn Popup Form
            document.getElementById('modalSinhVien').style.display = 'none';
        });
    }
});

// Hàm Xóa sinh viên
function deleteStudent(index) {
    if (confirm(`Bro có chắc muốn xóa sinh viên ${students[index].hoTen}?`)) {
        students.splice(index, 1);
        renderStudents(); // Cập nhật lại bảng
    }
}
// Danh sách dữ liệu mẫu ban đầu
let students = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'nva@karl.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' }
];

// Đổi format ngày sinh từ YYYY-MM-DD sang DD/MM/YYYY
function formatDate(dateString) {
    if(!dateString) return '';
    const parts = dateString.split('-');
    if(parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Hàm hiển thị danh sách sinh viên ra bảng HTML
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
            document.getElementById('formSinhVien').reset();
            document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
            document.getElementById('modalSinhVien').style.display = 'flex';
        };
    }

    // 3. Submit Form
    const form = document.getElementById('formSinhVien');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const newSV = {
                maSV: document.getElementById('maSV').value,
                hoTen: document.getElementById('hoTen').value,
                gioiTinh: document.getElementById('gioiTinh').value,
                ngaySinh: document.getElementById('ngaySinh').value,
                email: document.getElementById('email').value,
                lop: document.getElementById('lop').value,
                trangThai: 'Đang học'
            };

            students.push(newSV);
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

// Hàm Sửa (Tạm thời để trống chờ code)
function editStudent(index) {
    alert('Chuẩn bị code chức năng sửa nhé bro!');
}