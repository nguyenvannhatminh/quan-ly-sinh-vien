// Dữ liệu mặc định khởi tạo ban đầu
const defaultStudents = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn A', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'a.nguyen@truong.edu.vn', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị B', gioiTinh: 'Nữ', ngaySinh: '2005-08-20', email: 'b.tran@truong.edu.vn', lop: 'CNTT2', trangThai: 'Đang học' }
];

// Lấy dữ liệu từ localStorage hoặc dùng dữ liệu mặc định
let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien')) || defaultStudents;

// Lưu dữ liệu vào LocalStorage
function luuVaoLocalStorage() {
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
}

// Render dữ liệu ra bảng HTML
function renderBang(data = danhSachSinhVien) {
    const tbody = document.getElementById('bang-sinh-vien');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 20px; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        capNhatNutXoaChon();
        return;
    }

    data.forEach((sv) => {
        // Tìm vị trí gốc trong mảng danhSachSinhVien
        const indexGoc = danhSachSinhVien.findIndex(item => item.maSV === sv.maSV);

        // Format lại ngày sinh kiểu Việt Nam (DD/MM/YYYY)
        let ngaySinhFmt = sv.ngaySinh;
        if (sv.ngaySinh && sv.ngaySinh.includes('-')) {
            const [y, m, d] = sv.ngaySinh.split('-');
            ngaySinhFmt = `${d}/${m}/${y}`;
        }

        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid var(--border)';
        tr.innerHTML = `
            <td style="padding: 16px; text-align: center;">
                <input type="checkbox" class="check-item" data-index="${indexGoc}" style="cursor: pointer;" onchange="capNhatNutXoaChon()">
            </td>
            <td style="padding: 16px; font-weight: bold; color: #60a5fa;">${sv.maSV}</td>
            <td style="padding: 16px; font-weight: bold; color: white;">${sv.hoTen}</td>
            <td style="padding: 16px; color: var(--text-sub);">${sv.gioiTinh}</td>
            <td style="padding: 16px; color: var(--text-sub);">${ngaySinhFmt}</td>
            <td style="padding: 16px; color: var(--text-sub);">${sv.lop}</td>
            <td style="padding: 16px;">
                <span class="badge badge-active">${sv.trangThai || 'Đang học'}</span>
            </td>
            <td style="padding: 16px; text-align: right;">
                <button class="btn-action btn-edit" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                <button class="btn-action btn-delete" onclick="xoaSinhVien(${indexGoc})">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Reset nút CheckAll
    document.getElementById('checkAll').checked = false;
    capNhatNutXoaChon();
}

// Bắt sự kiện Lọc & Tìm kiếm
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

// Xử lý Modal Thêm / Sửa
const modalSinhVien = document.getElementById('modalSinhVien');
const formSinhVien = document.getElementById('formSinhVien');

document.getElementById('btnThemSV').onclick = () => {
    document.getElementById('modalTitle').innerText = 'Thêm Sinh Viên Mới';
    document.getElementById('editIndex').value = '-1';
    document.getElementById('maSV').readOnly = false;
    formSinhVien.reset();
    modalSinhVien.style.display = 'flex';
};

document.getElementById('btnHuyModal').onclick = () => {
    modalSinhVien.style.display = 'none';
};

function suaSinhVien(index) {
    const sv = danhSachSinhVien[index];
    document.getElementById('modalTitle').innerText = 'Chỉnh Sửa Thông Tin Sinh Viên';
    document.getElementById('editIndex').value = index;
    
    document.getElementById('maSV').value = sv.maSV;
    document.getElementById('maSV').readOnly = true; // Không cho sửa Mã SV
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
        // Kiểm tra trùng Mã SV khi thêm mới
        const daTonTai = danhSachSinhVien.some(sv => sv.maSV === studentData.maSV);
        if (daTonTai) {
            alert('Mã Sinh Viên này đã tồn tại trên hệ thống!');
            return;
        }
        danhSachSinhVien.push(studentData);
    } else {
        // Cập nhật sinh viên cũ
        danhSachSinhVien[index] = studentData;
    }

    luuVaoLocalStorage();
    locDuLieu();
    modalSinhVien.style.display = 'none';
};

// Xóa 1 sinh viên
function xoaSinhVien(index) {
    if (confirm(`Bạn có chắc chắn muốn xóa sinh viên ${danhSachSinhVien[index].hoTen} (${danhSachSinhVien[index].maSV}) không?`)) {
        danhSachSinhVien.splice(index, 1);
        luuVaoLocalStorage();
        locDuLieu();
    }
}

// Xử lý Checkbox Chọn tất cả & Xóa nhiều
const checkAll = document.getElementById('checkAll');
checkAll.addEventListener('change', function () {
    const checkboxes = document.querySelectorAll('.check-item');
    checkboxes.forEach(cb => cb.checked = this.checked);
    capNhatNutXoaChon();
});

function capNhatNutXoaChon() {
    const selectedBoxes = document.querySelectorAll('.check-item:checked');
    const btnXoaChon = document.getElementById('btnXoaChon');
    const countSpan = document.getElementById('countSelected');

    if (selectedBoxes.length > 0) {
        btnXoaChon.style.display = 'inline-block';
        countSpan.innerText = selectedBoxes.length;
    } else {
        btnXoaChon.style.display = 'none';
    }
}

document.getElementById('btnXoaChon').onclick = () => {
    const selectedBoxes = document.querySelectorAll('.check-item:checked');
    const danhSachXoaIndices = Array.from(selectedBoxes).map(cb => parseInt(cb.getAttribute('data-index')));

    if (confirm(`Bạn có chắc chắn muốn xóa ${danhSachXoaIndices.length} sinh viên đã chọn?`)) {
        danhSachSinhVien = danhSachSinhVien.filter((_, idx) => !danhSachXoaIndices.includes(idx));
        luuVaoLocalStorage();
        locDuLieu();
    }
};

// -------------------------------------------------------------
// XỬ LÝ XUẤT EXCEL (Export .xlsx)
// -------------------------------------------------------------
document.getElementById('btnXuatExcel').onclick = () => {
    if (danhSachSinhVien.length === 0) {
        alert("Hiện chưa có dữ liệu sinh viên nào để xuất file!");
        return;
    }

    // Map lại key tiếng Việt đẹp chuẩn báo cáo
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

    // Chỉnh độ rộng các cột cho cân đối
    worksheet['!cols'] = [
        { wch: 6 },  // STT
        { wch: 14 }, // Mã SV
        { wch: 24 }, // Họ và tên
        { wch: 10 }, // Giới tính
        { wch: 14 }, // Ngày sinh
        { wch: 28 }, // Email
        { wch: 12 }, // Lớp
        { wch: 14 }  // Trạng thái
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSinhVien");

    // Xuất file
    XLSX.writeFile(workbook, "Danh_Sach_Sinh_Vien_KarlSystem.xlsx");
};

// -------------------------------------------------------------
// XỬ LÝ NHẬP EXCEL (Import .xlsx)
// -------------------------------------------------------------
const modalExcel = document.getElementById('modalExcel');

document.getElementById('btnNhapExcel').onclick = () => {
    document.getElementById('fileExcelInput').value = '';
    modalExcel.style.display = 'flex';
};

document.getElementById('btnHuyExcelModal').onclick = () => {
    modalExcel.style.display = 'none';
};

document.getElementById('btnImportExcel').onclick = () => {
    const fileInput = document.getElementById('fileExcelInput');
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("Vui lòng chọn 1 file Excel (.xlsx hoặc .xls)!");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Lấy sheet đầu tiên
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Chuyển sheet thành dạng JSON
            const rows = XLSX.utils.sheet_to_json(worksheet);

            if (rows.length === 0) {
                alert("File Excel rỗng hoặc không đúng định dạng!");
                return;
            }

            let demMoi = 0;
            rows.forEach(row => {
                // Đọc linh hoạt tên cột trong file Excel
                const maSV = row["Mã Sinh Viên"] || row["Mã SV"] || row["maSV"];
                const hoTen = row["Họ và Tên"] || row["Họ tên"] || row["hoTen"];

                if (maSV && hoTen) {
                    const svObj = {
                        maSV: String(maSV).trim(),
                        hoTen: String(hoTen).trim(),
                        gioiTinh: row["Giới Tính"] || row["Giới tính"] || "Nam",
                        ngaySinh: row["Ngày Sinh"] || row["Ngày sinh"] || "2004-01-01",
                        email: row["Email"] || "",
                        lop: row["Lớp"] || "CNTT1",
                        trangThai: "Đang học"
                    };

                    // Nếu mã SV đã có thì cập nhật, chưa có thì thêm mới
                    const idxCoS
                    = danhSachSinhVien.findIndex(item => item.maSV === svObj.maSV);
                    if (idxCoS > -1) {
                        danhSachSinhVien[idxCoS] = svObj;
                    } else {
                        danhSachSinhVien.push(svObj);
                        demMoi++;
                    }
                }
            });

            luuVaoLocalStorage();
            locDuLieu();
            modalExcel.style.display = 'none';
            alert(`Đã nhập thành công dữ liệu từ Excel!`);
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi đọc file Excel. Vui lòng kiểm tra lại file!");
        }
    };

    reader.readAsArrayBuffer(file);
};

// Khởi chạy ban đầu
renderBang();