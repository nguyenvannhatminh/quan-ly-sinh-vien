// Danh sách dữ liệu mẫu ban đầu
let students = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'nva@karl.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị B', gioiTinh: 'Nữ', ngaySinh: '2005-08-20', email: 'ttb@karl.edu.vn', lop: 'CNTT2', trangThai: 'Đang học' }
];

let editIndex = -1;

function formatDate(dateString) {
    if(!dateString) return '';
    const parts = dateString.split('-');
    if(parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function renderStudents(dataToRender = students) {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="padding: 20px; text-align: center; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        return;
    }

    dataToRender.forEach((sv) => {
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

function filterData() {
    const searchKeyword = document.getElementById('timKiemInput').value.toLowerCase().trim();
    const selectedClass = document.getElementById('filterLop').value;

    const filtered = students.filter(sv => {
        const matchSearch = sv.maSV.toLowerCase().includes(searchKeyword) || sv.hoTen.toLowerCase().includes(searchKeyword);
        const matchClass = selectedClass === "" || sv.lop === selectedClass;
        return matchSearch && matchClass;
    });

    renderStudents(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    renderStudents();

    // 1. Bộ lọc & Tìm kiếm
    const searchInput = document.getElementById('timKiemInput');
    const filterSelect = document.getElementById('filterLop');
    if (searchInput) searchInput.addEventListener('input', filterData);
    if (filterSelect) filterSelect.addEventListener('change', filterData);

    // 2. Nút Thêm Sinh Viên
    const btnThem = document.getElementById('btnThemSV');
    if(btnThem) {
        btnThem.onclick = () => {
            editIndex = -1; 
            document.getElementById('formSinhVien').reset();
            document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
            document.getElementById('modalSinhVien').style.display = 'flex';
        };
    }

    // 3. Form Submit Thêm/Sửa
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

            filterData(); 
            document.getElementById('modalSinhVien').style.display = 'none';
        });
    }

    // 4. Mở Popup Nhập Excel
    const btnNhapExcel = document.getElementById('btnNhapExcel');
    if (btnNhapExcel) {
        btnNhapExcel.onclick = () => {
            document.getElementById('fileExcelInput').value = '';
            document.getElementById('modalExcel').style.display = 'flex';
        };
    }

    // 5. Xử lý đọc file Excel và import data
    const btnImport = document.getElementById('btnImportExcel');
    if (btnImport) {
        btnImport.onclick = () => {
            const fileInput = document.getElementById('fileExcelInput');
            if (!fileInput.files.length) {
                alert('Bro chưa chọn file Excel nào cả!');
                return;
            }

            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);

                    if (json.length === 0) {
                        alert('File Excel rỗng hoặc không đúng định dạng!');
                        return;
                    }

                    // Map từng dòng Excel vào danh sách sinh viên
                    json.forEach(row => {
                        students.push({
                            maSV: String(row['Mã SV'] || row['maSV'] || `SV${Math.floor(100 + Math.random() * 900)}`),
                            hoTen: String(row['Họ và tên'] || row['hoTen'] || 'Chưa đặt tên'),
                            gioiTinh: String(row['Giới tính'] || row['gioiTinh'] || 'Nam'),
                            ngaySinh: String(row['Ngày sinh'] || row['ngaySinh'] || '2004-01-01'),
                            email: String(row['Email'] || row['email'] || ''),
                            lop: String(row['Lớp'] || row['lop'] || 'CNTT1'),
                            trangThai: 'Đang học'
                        });
                    });

                    filterData();
                    document.getElementById('modalExcel').style.display = 'none';
                    alert(`🎉 Nhập thành công ${json.length} sinh viên từ file Excel!`);
                } catch (err) {
                    console.error(err);
                    alert('Lỗi đọc file Excel! Kiểm tra lại file nhé bro.');
                }
            };

            reader.readAsArrayBuffer(file);
        };
    }
});

function deleteStudent(index) {
    if (confirm(`Bro có chắc muốn xóa sinh viên ${students[index].hoTen}?`)) {
        students.splice(index, 1);
        filterData();
    }
}

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
// ==========================================
// 9. XUẤT DỮ LIỆU RA EXCEL (EXPORT)
// ==========================================

const btnXuatExcel = document.getElementById('btnXuatExcel');

if (btnXuatExcel) {
    btnXuatExcel.addEventListener('click', () => {
        const danhSach = layDanhSachSinhVien();
        const tuKhoa = timKiemInput.value.trim().toLowerCase();
        const lopDaChon = filterLop.value;

        // 1. Lọc dữ liệu y hệt như những gì đang hiển thị trên bảng
        const danhSachLoc = danhSach.filter(sv => {
            const khopTuKhoa = sv.hoTen.toLowerCase().includes(tuKhoa) || sv.maSV.toLowerCase().includes(tuKhoa);
            const khopLop = lopDaChon === '' || sv.lop === lopDaChon;
            return khopTuKhoa && khopLop;
        });

        if (danhSachLoc.length === 0) {
            alert('⚠️ Không có dữ liệu nào để xuất!');
            return;
        }

        // 2. Chuyển đổi tên các cột sang Tiếng Việt cho file Excel đẹp mắt
        const dataToExport = danhSachLoc.map(sv => ({
            'Mã Sinh Viên': sv.maSV,
            'Họ và Tên': sv.hoTen,
            'Giới Tính': sv.gioiTinh,
            'Ngày Sinh': địnhDạngNgày(sv.ngaySinh),
            'Email': sv.email,
            'Lớp': sv.lop,
            'Trạng Thái': sv.trangThai || 'Đang học'
        }));

        // 3. Sử dụng SheetJS để tạo workbook và tải xuống
        try {
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            
            // Chỉnh độ rộng các cột cho dễ nhìn
            const wscols = [
                {wch: 15}, // Mã SV
                {wch: 25}, // Họ Tên
                {wch: 10}, // Giới tính
                {wch: 15}, // Ngày sinh
                {wch: 30}, // Email
                {wch: 10}, // Lớp
                {wch: 15}  // Trạng thái
            ];
            worksheet['!cols'] = wscols;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Danh_Sach_SV");

            // Tự động tải file về máy
            XLSX.writeFile(workbook, 'Danh_Sach_Sinh_Vien.xlsx');
            
        } catch (error) {
            console.error(error);
            alert('❌ Lỗi trong quá trình tạo file Excel!');
        }
    });
}