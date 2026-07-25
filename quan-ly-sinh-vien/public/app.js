// Danh sách dữ liệu mẫu ban đầu
let students = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'nva@karl.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị B', gioiTinh: 'Nữ', ngaySinh: '2005-08-20', email: 'ttb@karl.edu.vn', lop: 'CNTT2', trangThai: 'Đang học' }
]; // Thêm 1 data mẫu nữa để bro test bộ lọc cho dễ

// Biến toàn cục để biết đang Thêm mới (-1) hay Sửa (>= 0)
let editIndex = -1;

// Đổi format ngày sinh từ YYYY-MM-DD sang DD/MM/YYYY
function formatDate(dateString) {
    if(!dateString) return '';
    const parts = dateString.split('-');
    if(parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// Hàm hiển thị danh sách sinh viên (Nhận vào 1 mảng dữ liệu, mặc định là mảng students gốc)
function renderStudents(dataToRender = students) {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Nếu không có dữ liệu nào khớp
    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="padding: 20px; text-align: center; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        return;
    }

    dataToRender.forEach((sv, index) => {
        // Tìm vị trí thật của sinh viên này trong mảng students gốc (để Sửa/Xóa cho đúng)
        const realIndex = students.findIndex(s => s.maSV === sv.maSV);

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
                <button onclick="editStudent(${realIndex})" style="background: #f59e0b; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; margin-right: 5px;">✏️ Sửa</button>
                <button onclick="deleteStudent(${realIndex})" style="background: #ef4444; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer;">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// HÀM XỬ LÝ TÌM KIẾM VÀ LỌC
function filterData() {
    const searchKeyword = document.getElementById('timKiemInput').value.toLowerCase().trim();
    const selectedClass = document.getElementById('filterLop').value;

    const filtered = students.filter(sv => {
        // Kiểm tra xem mã hoặc tên có chứa từ khóa không
        const matchSearch = sv.maSV.toLowerCase().includes(searchKeyword) || sv.hoTen.toLowerCase().includes(searchKeyword);
        // Kiểm tra xem có khớp lớp không (Nếu chọn "Tất cả các lớp" -> value rỗng -> luôn đúng)
        const matchClass = selectedClass === "" || sv.lop === selectedClass;

        return matchSearch && matchClass;
    });

    renderStudents(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render danh sách ban đầu
    renderStudents();

    // 2. Bắt sự kiện Tìm kiếm & Lọc
    document.getElementById('timKiemInput').addEventListener('input', filterData);
    document.getElementById('filterLop').addEventListener('change', filterData);

    // 3. Mở Modal Thêm Sinh Viên
    const btnThem = document.getElementById('btnThemSV');
    if(btnThem) {
        btnThem.onclick = () => {
            editIndex = -1; 
            document.getElementById('formSinhVien').reset();
            document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
            document.getElementById('modalSinhVien').style.display = 'flex';
        };
    }

    // 4. Xử lý Form Submit (Cho cả Thêm và Sửa)
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
                trangThai: editIndex === -1 ? 'Đang học' : students[editIndex].trangThai 
            };

            if (editIndex === -1) {
                students.push(studentData);
            } else {
                students[editIndex] = studentData;
            }

            // Gọi lại hàm filterData thay vì renderStudents để nó giữ nguyên bộ lọc hiện tại
            filterData(); 
            document.getElementById('modalSinhVien').style.display = 'none';
        });
    }
});

// Hàm Xóa
function deleteStudent(index) {
    if (confirm(`Bro có chắc muốn xóa sinh viên ${students[index].hoTen}?`)) {
        students.splice(index, 1);
        filterData(); // Cập nhật lại UI dựa trên bộ lọc
    }
}

// Hàm Sửa 
function editStudent(index) {
    editIndex = index; 
    const sv = students[index];

    document.getElementById('maSV').value = sv.maSV;
    document.getElementById('hoTen').value = sv.hoTen;
    document.getElementById('gioiTinh').value = sv.gioiTinh;
    document.getElementById('ngaySinh').value = sv.ngaySinh;
    document.getElementById('email').value = sv.email;
    document.getElementById('lop').value = sv.lop;

    document.getElementById('modalTitle').innerText = '✏️ Cập nhật thông tin Sinh Viên';
    document.getElementById('modalSinhVien').style.display = 'flex';
}