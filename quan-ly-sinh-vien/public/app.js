// =============================================================
// 1. DỮ LIỆU MẪU CHUẨN CÓ KHOA, EMAIL, TRẠNG THÁI
// =============================================================
const defaultStudents = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn Anh', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'anh.nv@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị Bảo', gioiTinh: 'Nữ', ngaySinh: '2004-08-20', email: 'bao.tt@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Bị cảnh báo' },
    { maSV: 'SV003', hoTen: 'Lê Hoàng Cường', gioiTinh: 'Nam', ngaySinh: '2003-11-05', email: 'cuong.lh@gmail.com', khoa: 'Kinh tế', lop: 'KT1', trangThai: 'Đang học' },
    { maSV: 'SV004', hoTen: 'Phạm Minh Dung', gioiTinh: 'Nữ', ngaySinh: '2002-02-14', email: 'dung.pm@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT2', trangThai: 'Đã tốt nghiệp' },
    { maSV: 'SV005', hoTen: 'Vũ Đức Em', gioiTinh: 'Nam', ngaySinh: '2004-09-30', email: 'em.vd@gmail.com', khoa: 'Điện - Điện tử', lop: 'CNTT3', trangThai: 'Đang học' }
];

let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien'));
if (!danhSachSinhVien || danhSachSinhVien.length === 0) {
    danhSachSinhVien = defaultStudents;
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
}

const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Admin', role: 'Admin' };

function luuVaoLocalStorage() {
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
}

// =============================================================
// 2. KHỞI TẠO & PHÂN QUYỀN
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('userName')) document.getElementById('userName').innerText = currentUser.name;
    if (document.getElementById('userRole')) document.getElementById('userRole').innerText = currentUser.role.toUpperCase();
    if (document.getElementById('userAvatar')) document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();

    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        };
    }

    apDungPhanQuyenUI();
    initTabSwitching();
    renderBang();
    capNhatDashboard();
});

function apDungPhanQuyenUI() {
    const btnThemSV = document.getElementById('btnThemSV');
    const btnNhapExcel = document.getElementById('btnNhapExcel');
    const colCheckAll = document.getElementById('colCheckAll');
    const colHanhDong = document.getElementById('colHanhDong');

    if (currentUser.role === 'Giảng viên') {
        if (btnNhapExcel) btnNhapExcel.style.display = 'none';
        if (colCheckAll) colCheckAll.style.display = 'none';
    } else if (currentUser.role === 'Sinh viên') {
        if (btnThemSV) btnThemSV.style.display = 'none';
        if (btnNhapExcel) btnNhapExcel.style.display = 'none';
        if (colCheckAll) colCheckAll.style.display = 'none';
        if (colHanhDong) colHanhDong.style.display = 'none';
    }
}

// =============================================================
// 3. TAB CHUYỂN DỔI & DASHBOARD
// =============================================================
let chartClassInstance = null;
let chartGenderInstance = null;

function initTabSwitching() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        item.addEventListener('click', function() {
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');

            const text = this.innerText.trim();
            const tabDashboard = document.getElementById('section-dashboard');
            const tabStudents = document.getElementById('section-students');

            if (text.includes('Dashboard')) {
                tabDashboard.style.display = 'block';
                tabStudents.style.display = 'none';
                capNhatDashboard();
            } else {
                tabDashboard.style.display = 'none';
                tabStudents.style.display = 'block';
            }
        });
    });
}

function capNhatDashboard() {
    const total = danhSachSinhVien.length;
    const activeCount = danhSachSinhVien.filter(sv => (sv.trangThai || 'Đang học') === 'Đang học').length;
    const warningCount = danhSachSinhVien.filter(sv => sv.trangThai === 'Bị cảnh báo').length;
    const graduatedCount = danhSachSinhVien.filter(sv => sv.trangThai === 'Đã tốt nghiệp').length;

    if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = total;
    if (document.getElementById('statActive')) document.getElementById('statActive').innerText = activeCount;
    if (document.getElementById('statWarning')) document.getElementById('statWarning').innerText = warningCount;
    if (document.getElementById('statGraduated')) document.getElementById('statGraduated').innerText = graduatedCount;

    // Biểu đồ lớp
    const classCounts = {};
    danhSachSinhVien.forEach(sv => classCounts[sv.lop] = (classCounts[sv.lop] || 0) + 1);

    const elChartClass = document.getElementById('chartClass');
    if (elChartClass) {
        const ctxClass = elChartClass.getContext('2d');
        if (chartClassInstance) chartClassInstance.destroy();
        chartClassInstance = new Chart(ctxClass, {
            type: 'bar',
            data: {
                labels: Object.keys(classCounts),
                datasets: [{ label: 'Số sinh viên', data: Object.values(classCounts), backgroundColor: '#3b82f6', borderRadius: 6 }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } }
            }
        });
    }

    // Biểu đồ giới tính
    const namCount = danhSachSinhVien.filter(sv => sv.gioiTinh === 'Nam').length;
    const nuCount = danhSachSinhVien.filter(sv => sv.gioiTinh === 'Nữ').length;
    const elChartGender = document.getElementById('chartGender');
    if (elChartGender) {
        const ctxGender = elChartGender.getContext('2d');
        if (chartGenderInstance) chartGenderInstance.destroy();
        chartGenderInstance = new Chart(ctxGender, {
            type: 'doughnut',
            data: { labels: ['Nam', 'Nữ'], datasets: [{ data: [namCount, nuCount], backgroundColor: ['#60a5fa', '#f472b6'] }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#cbd5e1' } } } }
        });
    }
}

// =============================================================
// 4. BẢNG SINH VIÊN & BỘ LỌC ĐA NĂNG
// =============================================================
function renderBang(data = danhSachSinhVien) {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;
    tbody.innerHTML = '';

    const isSinhVien = currentUser.role === 'Sinh viên';
    const isGiangVien = currentUser.role === 'Giảng viên';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        return;
    }

    data.forEach((sv) => {
        const indexGoc = danhSachSinhVien.findIndex(item => item.maSV === sv.maSV);

        const colCheckbox = (!isSinhVien && !isGiangVien) 
            ? `<td style="text-align: center;"><input type="checkbox" class="check-item" data-index="${indexGoc}" onchange="capNhatNutXoaChon()"></td>`
            : '';

        let colActions = '';
        if (currentUser.role === 'Admin') {
            colActions = `
                <td style="text-align: right;">
                    <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                    <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaSinhVien(${indexGoc})">🗑️ Xóa</button>
                </td>`;
        } else if (currentUser.role === 'Giảng viên') {
            colActions = `
                <td style="text-align: right;">
                    <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                </td>`;
        }

        let badgeClass = 'badge-danghoc';
        if (sv.trangThai === 'Bị cảnh báo') badgeClass = 'badge-canhbao';
        else if (sv.trangThai === 'Đã tốt nghiệp') badgeClass = 'badge-totnghiep';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            ${colCheckbox}
            <td style="font-weight: bold; color: #60a5fa;">${sv.maSV}</td>
            <td style="font-weight: 600;">${sv.hoTen}</td>
            <td>${sv.gioiTinh}</td>
            <td style="color: var(--text-sub);">${sv.email || '—'}</td>
            <td style="color: var(--text-sub);">${sv.khoa || 'CNTT'}</td>
            <td>${sv.lop}</td>
            <td><span class="badge ${badgeClass}">${sv.trangThai || 'Đang học'}</span></td>
            ${colActions}
        `;
        tbody.appendChild(tr);
    });

    capNhatNutXoaChon();
}

function locDuLieu() {
    const tuKhoa = (document.getElementById('timKiemInput')?.value || '').toLowerCase().trim();
    const khoaChon = document.getElementById('filterKhoa')?.value || '';
    const lopChon = document.getElementById('filterLop')?.value || '';

    const ketQua = danhSachSinhVien.filter(sv => {
        const khopTuKhoa = sv.hoTen.toLowerCase().includes(tuKhoa) || sv.maSV.toLowerCase().includes(tuKhoa) || (sv.email && sv.email.toLowerCase().includes(tuKhoa));
        const khopKhoa = khoaChon === '' || (sv.khoa || 'Công nghệ thông tin') === khoaChon;
        const khopLop = lopChon === '' || sv.lop === lopChon;
        return khopTuKhoa && khopKhoa && khopLop;
    });

    renderBang(ketQua);
}

document.getElementById('timKiemInput')?.addEventListener('input', locDuLieu);
document.getElementById('filterKhoa')?.addEventListener('change', locDuLieu);
document.getElementById('filterLop')?.addEventListener('change', locDuLieu);

// =============================================================
// 5. MODAL THÊM / SỬA / XÓA
// =============================================================
const modalSinhVien = document.getElementById('modalSinhVien');
const formSinhVien = document.getElementById('formSinhVien');

if (document.getElementById('btnThemSV')) {
    document.getElementById('btnThemSV').onclick = () => {
        document.getElementById('modalTitle').innerText = '➕ Thêm Sinh Viên Mới';
        document.getElementById('editIndex').value = '-1';
        document.getElementById('inputMaSV').readOnly = false;
        formSinhVien.reset();
        modalSinhVien.style.display = 'flex';
    };
}

if (document.getElementById('btnHuyModal')) {
    document.getElementById('btnHuyModal').onclick = () => modalSinhVien.style.display = 'none';
}

function suaSinhVien(index) {
    const sv = danhSachSinhVien[index];
    document.getElementById('modalTitle').innerText = '✏️ Chỉnh Sửa Sinh Viên';
    document.getElementById('editIndex').value = index;
    
    document.getElementById('inputMaSV').value = sv.maSV;
    document.getElementById('inputMaSV').readOnly = true;
    document.getElementById('inputHoTen').value = sv.hoTen;
    document.getElementById('selectGioiTinh').value = sv.gioiTinh;
    document.getElementById('inputNgaySinh').value = sv.ngaySinh;
    document.getElementById('inputEmail').value = sv.email || '';
    document.getElementById('selectKhoa').value = sv.khoa || 'Công nghệ thông tin';
    document.getElementById('selectLop').value = sv.lop;
    document.getElementById('selectTrangThai').value = sv.trangThai || 'Đang học';

    modalSinhVien.style.display = 'flex';
}

if (formSinhVien) {
    formSinhVien.onsubmit = (e) => {
        e.preventDefault();
        const index = parseInt(document.getElementById('editIndex').value);
        
        const studentData = {
            maSV: document.getElementById('inputMaSV').value.trim(),
            hoTen: document.getElementById('inputHoTen').value.trim(),
            gioiTinh: document.getElementById('selectGioiTinh').value,
            ngaySinh: document.getElementById('inputNgaySinh').value,
            email: document.getElementById('inputEmail').value.trim(),
            khoa: document.getElementById('selectKhoa').value,
            lop: document.getElementById('selectLop').value,
            trangThai: document.getElementById('selectTrangThai').value
        };

        if (index === -1) {
            if (danhSachSinhVien.some(sv => sv.maSV === studentData.maSV)) {
                alert('⚠️ Mã Sinh Viên này đã tồn tại!');
                return;
            }
            danhSachSinhVien.push(studentData);
        } else {
            danhSachSinhVien[index] = studentData;
        }

        luuVaoLocalStorage();
        locDuLieu();
        capNhatDashboard();
        modalSinhVien.style.display = 'none';
    };
}

function xoaSinhVien(index) {
    if (confirm(`🗑️ Bạn có chắc chắn muốn xóa sinh viên ${danhSachSinhVien[index].hoTen}?`)) {
        danhSachSinhVien.splice(index, 1);
        luuVaoLocalStorage();
        locDuLieu();
        capNhatDashboard();
    }
}

// Xóa chọn
const checkAll = document.getElementById('checkAll');
if (checkAll) {
    checkAll.addEventListener('change', function () {
        document.querySelectorAll('.check-item').forEach(cb => cb.checked = this.checked);
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
            if (countSpan) countSpan.innerText = selectedBoxes.length;
        } else {
            btnXoaChon.style.display = 'none';
        }
    }
}

const btnXoaChon = document.getElementById('btnXoaChon');
if (btnXoaChon) {
    btnXoaChon.onclick = () => {
        const selectedBoxes = document.querySelectorAll('.check-item:checked');
        const indices = Array.from(selectedBoxes).map(cb => parseInt(cb.getAttribute('data-index')));

        if (confirm(`🗑️ Bạn có chắc chắn muốn xóa ${indices.length} sinh viên đã chọn?`)) {
            danhSachSinhVien = danhSachSinhVien.filter((_, idx) => !indices.includes(idx));
            luuVaoLocalStorage();
            locDuLieu();
            capNhatDashboard();
        }
    };
}

// =============================================================
// 6. EXCEL EXPORT & IMPORT (CÓ EMAIL VÀ KHOA)
// =============================================================
const btnXuatExcel = document.getElementById('btnXuatExcel');
if (btnXuatExcel) {
    btnXuatExcel.onclick = () => {
        const dataExport = danhSachSinhVien.map((sv, idx) => ({
            "STT": idx + 1,
            "Mã Sinh Viên": sv.maSV,
            "Họ và Tên": sv.hoTen,
            "Giới Tính": sv.gioiTinh,
            "Ngày Sinh": sv.ngaySinh,
            "Email": sv.email || '',
            "Khoa / Ngành": sv.khoa || 'Công nghệ thông tin',
            "Lớp": sv.lop,
            "Trạng Thái": sv.trangThai || 'Đang học'
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSinhVien");
        XLSX.writeFile(workbook, "Danh_Sach_Sinh_Vien.xlsx");
    };
}

const btnNhapExcel = document.getElementById('btnNhapExcel');
const fileExcelInput = document.getElementById('fileExcelInput');

if (btnNhapExcel && fileExcelInput) {
    btnNhapExcel.onclick = () => fileExcelInput.click();

    fileExcelInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
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
                            khoa: row["Khoa / Ngành"] || row["Khoa"] || "Công nghệ thông tin",
                            lop: row["Lớp"] || "CNTT1",
                            trangThai: row["Trạng Thái"] || "Đang học"
                        };
                        const idx = danhSachSinhVien.findIndex(i => i.maSV === svObj.maSV);
                        if (idx > -1) danhSachSinhVien[idx] = svObj;
                        else danhSachSinhVien.push(svObj);
                    }
                });

                luuVaoLocalStorage();
                locDuLieu();
                capNhatDashboard();
                alert('📥 Nhập danh sách sinh viên từ Excel thành công!');
            } catch (err) {
                alert('❌ File Excel không hợp lệ!');
            }
        };
        reader.readAsArrayBuffer(file);
    };
}