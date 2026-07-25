// =============================================================
// 1. KIỂM TRA ĐĂNG NHẬP & PHÂN QUYỀN (AUTH CHECK)
// =============================================================
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Nếu chưa đăng nhập -> Đá về trang login.html ngay
if (!currentUser) {
    window.location.href = 'login.html';
}

// Hàm đăng xuất
function dangXuat() {
    if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
}

// Cập nhật thông tin User trên Header & Áp dụng Phân quyền
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('userNameHeader').innerText = currentUser.name;
    const roleBadge = document.getElementById('roleBadgeHeader');
    
    roleBadge.innerText = currentUser.role;
    if (currentUser.role === 'Admin') roleBadge.className = 'role-badge role-admin';
    else if (currentUser.role === 'Giảng viên') roleBadge.className = 'role-badge role-giangvien';
    else roleBadge.className = 'role-badge role-sinhvien';

    apDungPhanQuyenUI();
});

function apDungPhanQuyenUI() {
    const btnThemSV = document.getElementById('btnThemSV');
    const btnNhapExcel = document.getElementById('btnNhapExcel');
    const colCheckAll = document.getElementById('colCheckAll');
    const colHanhDong = document.getElementById('colHanhDong');

    if (currentUser.role === 'Giảng viên') {
        // Giảng viên: Được thêm/sửa, xuất excel, KHÔNG ĐƯỢC nhập excel hoặc xóa
        if (btnNhapExcel) btnNhapExcel.style.display = 'none';
        if (colCheckAll) colCheckAll.style.display = 'none';
    } else if (currentUser.role === 'Sinh viên') {
        // Sinh viên: Chỉ được XEM và tìm kiếm, ẩn toàn bộ nút chức năng tác động
        if (btnThemSV) btnThemSV.style.display = 'none';
        if (btnNhapExcel) btnNhapExcel.style.display = 'none';
        if (colCheckAll) colCheckAll.style.display = 'none';
        if (colHanhDong) colHanhDong.style.display = 'none';
    }
}

// =============================================================
// 2. BỘ DỮ LIỆU & RENDER BẢNG
// =============================================================
const defaultStudents = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'a.nguyen@truong.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị B', gioiTinh: 'Nữ', ngaySinh: '2005-08-20', email: 'b.tran@truong.edu.vn', lop: 'CNTT2', trangThai: 'Đang học' }
];

let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien')) || defaultStudents;

function luuVaoLocalStorage() {
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
}

function renderBang(data = danhSachSinhVien) {
    const tbody = document.getElementById('bang-sinh-vien');
    tbody.innerHTML = '';

    const isSinhVien = currentUser.role === 'Sinh viên';
    const isGiangVien = currentUser.role === 'Giảng viên';

    if (data.length === 0) {
        const colSpan = isSinhVien ? 6 : (isGiangVien ? 7 : 8);
        tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 20px; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        capNhatNutXoaChon();
        return;
    }

    data.forEach((sv) => {
        const indexGoc = danhSachSinhVien.findIndex(item => item.maSV === sv.maSV);

        let ngaySinhFmt = sv.ngaySinh;
        if (sv.ngaySinh && sv.ngaySinh.includes('-')) {
            const [y, m, d] = sv.ngaySinh.split('-');
            ngaySinhFmt = `${d}/${m}/${y}`;
        }

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border)';

        // Cột Checkbox (Chỉ Admin thấy)
        const colCheckbox = (!isSinhVien && !isGiangVien) 
            ? `<td style="padding: 16px; text-align: center;"><input type="checkbox" class="check-item" data-index="${indexGoc}" style="cursor: pointer;" onchange="capNhatNutXoaChon()"></td>`
            : '';

        // Cột Hành động (Admin thấy Sửa+Xóa, Giảng viên chỉ thấy Sửa, Sinh viên ẩn)
        let colActions = '';
        if (currentUser.role === 'Admin') {
            colActions = `
                <td style="padding: 16px; text-align: right;">
                    <button class="btn-action btn-edit" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                    <button class="btn-action btn-delete" onclick="xoaSinhVien(${indexGoc})">🗑️ Xóa</button>
                </td>`;
        } else if (currentUser.role === 'Giảng viên') {
            colActions = `
                <td style="padding: 16px; text-align: right;">
                    <button class="btn-action btn-edit" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                </td>`;
        }

        tr.innerHTML = `
            ${colCheckbox}
            <td style="padding: 16px; font-weight: bold; color: #60a5fa;">${sv.maSV}</td>
            <td style="padding: 16px; font-weight: bold; color: white;">${sv.hoTen}</td>
            <td style="padding: 16px; color: var(--text-sub);">${sv.gioiTinh}</td>
            <td style="padding: 16px; color: var(--text-sub);">${ngaySinhFmt}</td>
            <td style="padding: 16px; color: var(--text-sub);">${sv.lop}</td>
            <td style="padding: 16px;"><span class="badge badge-active">${sv.trangThai || 'Đang học'}</span></td>
            ${colActions}
        `;
        tbody.appendChild(tr);
    });

    const checkAll = document.getElementById('checkAll');
    if (checkAll) checkAll.checked = false;
    capNhatNutXoaChon();
}

// =============================================================
// 3. TÌM KIẾM, LỌC & LỚP
// =============================================================
function locDuLieu() {
    const tuKhoa = document.getElementById('timKiemInput').value.toLowerCase().trim();
    const lopChon = document.getElementById('filterLop').value;

    const ketQua = danhSachSinhVien.filter(sv => {
        const khopTuKhoa = sv.hoTen.toLowerCase().includes(tuKhoa) || sv.maSV.toLowerCase().includes(tuKhoa);
        const khopLop = lopChon === '' || sv.lop === lopChon;
        return khopTuKhoa && khopLop;
    });

    renderBang(ketQua);
}

document.getElementById('timKiemInput').addEventListener('input', locDuLieu);
document.getElementById('filterLop').addEventListener('change', locDuLieu);

// =============================================================
// 4. MODAL THÊM / SỬA / XÓA
// =============================================================
const modalSinhVien = document.getElementById('modalSinhVien');
const formSinhVien = document.getElementById('formSinhVien');

document.getElementById('btnThemSV').onclick = () => {
    document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
    document.getElementById('editIndex').value = '-1';
    document.getElementById('maSV').readOnly = false;
    formSinhVien.reset();
    modalSinhVien.style.display = 'flex';
};

document.getElementById('btnHuyModal').onclick = () => { modalSinhVien.style.display = 'none'; };

function suaSinhVien(index) {
    const sv = danhSachSinhVien[index];
    document.getElementById('modalTitle').innerText = 'Chỉnh Sửa Thông Tin Sinh Viên';
    document.getElementById('editIndex').value = index;
    
    document.getElementById('maSV').value = sv.maSV;
    document.getElementById('maSV').readOnly = true;
    document.getElementById('hoTen').value = sv.hoTen;
    document.getElementById('gioiTinh').value = sv.gioiTinh;
    document.getElementById('ngaySinh').value = sv.ngaySinh;
    document.getElementById('email').value = sv.email || '';
    document.getElementById('lop').value = sv.lop;

    modalSinhVien.style.display = 'flex';
}

formSinhVien.onsubmit = (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('editIndex').value);
    
    const studentData = {
        maSV: document.getElementById('maSV').value.trim(),
        hoTen: document.getElementById('hoTen').value.trim(),
        gioiTinh: document.getElementById('gioiTinh').value,
        ngaySinh: document.getElementById('ngaySinh').value,
        email: document.getElementById('email').value.trim(),
        lop: document.getElementById('lop').value,
        trangThai: 'Đang học'
    };

    if (index === -1) {
        if (danhSachSinhVien.some(sv => sv.maSV === studentData.maSV)) {
            alert('Mã Sinh Viên này đã tồn tại trên hệ thống!');
            return;
        }
        danhSachSinhVien.push(studentData);
    } else {
        danhSachSinhVien[index] = studentData;
    }

    luuVaoLocalStorage();
    locDuLieu();
    modalSinhVien.style.display = 'none';
};

function xoaSinhVien(index) {
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên ${danhSachSinhVien[index].hoTen} (${danhSachSinhVien[index].maSV}) không?`)) {
        danhSachSinhVien.splice(index, 1);
        luuVaoLocalStorage();
        locDuLieu();
    }
}

// Checkbox & Xóa hàng loạt
const checkAll = document.getElementById('checkAll');
if (checkAll) {
    checkAll.addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('.check-item');
        checkboxes.forEach(cb => cb.checked = this.checked);
        capNhatNutXoaChon();
    });
}

function capNhatNutXoaChon() {
    const selectedBoxes = document.querySelectorAll('.check-item:checked');
    const btnXoaChon = document.getElementById('btnXoaChon');
    const countSpan = document.getElementById('countSelected');

    if (btnXoaChon) {
        if (selectedBoxes.length > 0) {
            btnXoaChon.style.display = 'inline-block';
            countSpan.innerText = selectedBoxes.length;
        } else {
            btnXoaChon.style.display = 'none';
        }
    }
}

const btnXoaChon = document.getElementById('btnXoaChon');
if (btnXoaChon) {
    btnXoaChon.onclick = () => {
        const selectedBoxes = document.querySelectorAll('.check-item:checked');
        const danhSachXoaIndices = Array.from(selectedBoxes).map(cb => parseInt(cb.getAttribute('data-index')));

        if (confirm(`Bạn có chắc chắn muốn xóa ${danhSachXoaIndices.length} sinh viên đã chọn?`)) {
            danhSachSinhVien = danhSachSinhVien.filter((_, idx) => !danhSachXoaIndices.includes(idx));
            luuVaoLocalStorage();
            locDuLieu();
        }
    };
}

// =============================================================
// 5. EXCEL EXPORT & IMPORT
// =============================================================
document.getElementById('btnXuatExcel').onclick = () => {
    if (danhSachSinhVien.length === 0) {
        alert("Không có dữ liệu để xuất file!");
        return;
    }
    const dataExport = danhSachSinhVien.map((sv, idx) => ({
        "STT": idx + 1,
        "Mã Sinh Viên": sv.maSV,
        "Họ và Tên": sv.hoTen,
        "Giới Tính": sv.gioiTinh,
        "Ngày Sinh": sv.ngaySinh,
        "Email": sv.email || '',
        "Lớp": sv.lop,
        "Trạng Thái": sv.trangThai || 'Đang học'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataExport);
    worksheet['!cols'] = [{ wch: 6 }, { wch: 14 }, { wch: 24 }, { wch: 10 }, { wch: 14 }, { wch: 28 }, { wch: 12 }, { wch: 14 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSinhVien");
    XLSX.writeFile(workbook, "Danh_Sach_Sinh_Vien.xlsx");
};

const modalExcel = document.getElementById('modalExcel');
const btnNhapExcel = document.getElementById('btnNhapExcel');

if (btnNhapExcel) {
    btnNhapExcel.onclick = () => {
        document.getElementById('fileExcelInput').value = '';
        modalExcel.style.display = 'flex';
    };
}

document.getElementById('btnHuyExcelModal').onclick = () => { modalExcel.style.display = 'none'; };

document.getElementById('btnImportExcel').onclick = () => {
    const fileInput = document.getElementById('fileExcelInput');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Vui lòng chọn 1 file Excel!");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

            rows.forEach(row => {
                const maSV = row["Mã Sinh Viên"] || row["Mã SV"] || row["maSV"];
                const hoTen = row["Họ và Tên"] || row["Họ tên"] || row["hoTen"];

                if (maSV && hoTen) {
                    const svObj = {
                        maSV: String(maSV).trim(),
                        hoTen: String(hoTen).trim(),
                        gioiTinh: row["Giới Tính"] || "Nam",
                        ngaySinh: row["Ngày Sinh"] || "2004-01-01",
                        email: row["Email"] || "",
                        lop: row["Lớp"] || "CNTT1",
                        trangThai: "Đang học"
                    };
                    const idx = danhSachSinhVien.findIndex(i => i.maSV === svObj.maSV);
                    if (idx > -1) danhSachSinhVien[idx] = svObj;
                    else danhSachSinhVien.push(svObj);
                }
            });

            luuVaoLocalStorage();
            locDuLieu();
            modalExcel.style.display = 'none';
            alert("Đã nhập thành công từ Excel!");
        } catch (err) {
            alert("Lỗi đọc file Excel!");
        }
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
};

// Khởi tạo
renderBang();