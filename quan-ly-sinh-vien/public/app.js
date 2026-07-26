// =============================================================
// 1. KIỂM TRA SESSION ĐĂNG NHẬP
// =============================================================
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Admin User', role: 'Admin', username: 'admin' };

const defaultUsers = [
    { username: 'admin', password: '123456', hoTen: 'Quản trị viên', email: 'admin@truong.edu.vn', role: 'Admin' },
    { username: 'giangvien', password: '123456', hoTen: 'ThS. Nguyễn Văn A', email: 'gv.nguyenvana@truong.edu.vn', role: 'Giảng viên' },
    { username: 'sinhvien', password: '123456', hoTen: 'Trần Văn B', email: 'sv.tranvanb@truong.edu.vn', role: 'Sinh viên' }
];
const defaultKhoa = [
    { maKhoa: 'CNTT', tenKhoa: 'Công nghệ thông tin', moTa: 'Đào tạo kỹ sư phần mềm, AI' },
    { maKhoa: 'KT', tenKhoa: 'Kinh tế', moTa: 'Đào tạo quản trị kinh doanh, kế toán' },
    { maKhoa: 'DDT', tenKhoa: 'Điện - Điện tử', moTa: 'Đào tạo kỹ sư điện, tự động hóa' }
];
const defaultLop = [
    { maLop: 'CNTT1', tenLop: 'Công nghệ thông tin 1', khoa: 'Công nghệ thông tin' },
    { maLop: 'CNTT2', tenLop: 'Công nghệ thông tin 2', khoa: 'Công nghệ thông tin' },
    { maLop: 'CNTT3', tenLop: 'Công nghệ thông tin 3', khoa: 'Công nghệ thông tin' },
    { maLop: 'KT1', tenLop: 'Kinh tế 1', khoa: 'Kinh tế' }
];
const defaultStudents = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn Anh', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'anh.nv@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị Bảo', gioiTinh: 'Nữ', ngaySinh: '2004-08-20', email: 'bao.tt@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Bị cảnh báo' },
    { maSV: 'SV003', hoTen: 'Lê Hoàng Cường', gioiTinh: 'Nam', ngaySinh: '2003-11-05', email: 'cuong.lh@gmail.com', khoa: 'Kinh tế', lop: 'KT1', trangThai: 'Đang học' },
    { maSV: 'SV004', hoTen: 'Phạm Minh Dung', gioiTinh: 'Nữ', ngaySinh: '2002-02-14', email: 'dung.pm@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT2', trangThai: 'Đã tốt nghiệp' },
    { maSV: 'SV005', hoTen: 'Vũ Đức Em', gioiTinh: 'Nam', ngaySinh: '2004-09-30', email: 'em.vd@gmail.com', khoa: 'Điện - Điện tử', lop: 'CNTT3', trangThai: 'Đang học' }
];
const defaultMonHoc = [
    { maMH: 'INT1001', tenMH: 'Cấu trúc dữ liệu & Giải thuật', tinChi: 3, loaiMon: 'Bắt buộc' },
    { maMH: 'INT1002', tenMH: 'Lập trình Web Cơ bản', tinChi: 3, loaiMon: 'Bắt buộc' },
    { maMH: 'INT1003', tenMH: 'Cơ sở dữ liệu SQL', tinChi: 4, loaiMon: 'Bắt buộc' },
    { maMH: 'ENG1001', tenMH: 'Tiếng Anh Chuyên ngành', tinChi: 2, loaiMon: 'Tự chọn' }
];
const defaultDiem = [
    { maSV: 'SV001', maMH: 'INT1001', diemQT: 8.5, diemThi: 8.0 },
    { maSV: 'SV001', maMH: 'INT1002', diemQT: 9.0, diemThi: 8.5 },
    { maSV: 'SV002', maMH: 'INT1001', diemQT: 4.0, diemThi: 3.5 },
    { maSV: 'SV003', maMH: 'INT1003', diemQT: 7.5, diemThi: 8.0 }
];

let danhSachUsers = JSON.parse(localStorage.getItem('danhSachUsers')) || defaultUsers;
let danhSachKhoa = JSON.parse(localStorage.getItem('danhSachKhoa')) || defaultKhoa;
let danhSachLop = JSON.parse(localStorage.getItem('danhSachLop')) || defaultLop;
let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien')) || defaultStudents;
let danhSachMonHoc = JSON.parse(localStorage.getItem('danhSachMonHoc')) || defaultMonHoc;
let danhSachDiem = JSON.parse(localStorage.getItem('danhSachDiem')) || defaultDiem;
let danhSachDangKy = JSON.parse(localStorage.getItem('danhSachDangKy')) || ['INT1001', 'INT1002'];

function luuTatCaData() {
    localStorage.setItem('danhSachUsers', JSON.stringify(danhSachUsers));
    localStorage.setItem('danhSachKhoa', JSON.stringify(danhSachKhoa));
    localStorage.setItem('danhSachLop', JSON.stringify(danhSachLop));
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
    localStorage.setItem('danhSachMonHoc', JSON.stringify(danhSachMonHoc));
    localStorage.setItem('danhSachDiem', JSON.stringify(danhSachDiem));
    localStorage.setItem('danhSachDangKy', JSON.stringify(danhSachDangKy));
}

// =============================================================
// 2. KHỞI TẠO VÀ PHÂN QUYỀN HỆ THỐNG
// =============================================================
let chartClassInstance = null;
let chartGenderInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    capNhatUIUserInfo();
    
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        };
    }

    const elUserInfo = document.querySelector('.user-info');
    if (elUserInfo) {
        elUserInfo.style.cursor = 'pointer';
        elUserInfo.title = 'Bấm để xem hồ sơ / đổi mật khẩu';
        elUserInfo.onclick = moModalProfile;
    }

    apDungPhanQuyenRBAC();
    dongBoDropdownSelects();
    initTabSwitching();
    initFormListeners();

    // Render dữ liệu ban đầu
    locDuLieu();
    renderBangLop();
    renderBangKhoa();
    renderBangUser();
    renderBangMonHoc();
    renderBangDangKyMon();
    renderBangDiem();
    capNhatDashboard();
    initExcelEvents();
});

function capNhatUIUserInfo() {
    if (document.getElementById('userName')) document.getElementById('userName').innerText = currentUser.name || currentUser.hoTen;
    if (document.getElementById('userRole')) document.getElementById('userRole').innerText = currentUser.role.toUpperCase();
    if (document.getElementById('userAvatar')) document.getElementById('userAvatar').innerText = (currentUser.name || currentUser.hoTen || 'A').charAt(0).toUpperCase();
}

function apDungPhanQuyenRBAC() {
    const role = currentUser.role;
    if (role !== 'Admin') {
        const menuUsers = document.getElementById('menuUsers');
        if (menuUsers) menuUsers.style.display = 'none';
        if (document.getElementById('btnThemLop')) document.getElementById('btnThemLop').style.display = 'none';
        if (document.getElementById('btnThemKhoa')) document.getElementById('btnThemKhoa').style.display = 'none';
    }
    if (role === 'Sinh viên') {
        if (document.getElementById('btnThemSV')) document.getElementById('btnThemSV').style.display = 'none';
        if (document.getElementById('btnNhapExcel')) document.getElementById('btnNhapExcel').style.display = 'none';
        if (document.getElementById('colCheckAll')) document.getElementById('colCheckAll').style.display = 'none';
        if (document.getElementById('colHanhDong')) document.getElementById('colHanhDong').style.display = 'none';
        document.querySelectorAll('.colHanhDongChung').forEach(el => el.style.display = 'none');
    }
    if (role === 'Giảng viên') {
        if (document.getElementById('btnThemSV')) document.getElementById('btnThemSV').style.display = 'none';
        if (document.getElementById('btnNhapExcel')) document.getElementById('btnNhapExcel').style.display = 'none';
        if (document.getElementById('colCheckAll')) document.getElementById('colCheckAll').style.display = 'none';
    }
}

function dongModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function dongBoDropdownSelects() {
    const filterKhoa = document.getElementById('filterKhoa');
    const selectKhoa = document.getElementById('selectKhoa');
    const selectKhoaForLop = document.getElementById('selectKhoaForLop');
    
    let htmlKhoaOptions = '<option value="">🏢 Tất cả Khoa</option>';
    let htmlFormKhoaOptions = '';
    danhSachKhoa.forEach(k => {
        htmlKhoaOptions += `<option value="${k.tenKhoa}">${k.tenKhoa}</option>`;
        htmlFormKhoaOptions += `<option value="${k.tenKhoa}">${k.tenKhoa}</option>`;
    });
    if (filterKhoa) filterKhoa.innerHTML = htmlKhoaOptions;
    if (selectKhoa) selectKhoa.innerHTML = htmlFormKhoaOptions;
    if (selectKhoaForLop) selectKhoaForLop.innerHTML = htmlFormKhoaOptions;

    const filterLop = document.getElementById('filterLop');
    const selectLop = document.getElementById('selectLop');
    let htmlLopOptions = '<option value="">🏫 Tất cả Lớp</option>';
    let htmlFormLopOptions = '';
    danhSachLop.forEach(l => {
        htmlLopOptions += `<option value="${l.maLop}">${l.maLop}</option>`;
        htmlFormLopOptions += `<option value="${l.maLop}">${l.maLop}</option>`;
    });
    if (filterLop) filterLop.innerHTML = htmlLopOptions;
    if (selectLop) selectLop.innerHTML = htmlFormLopOptions;

    const filterMonHoc_Diem = document.getElementById('filterMonHoc_Diem');
    if (filterMonHoc_Diem) {
        let htmlMH = '<option value="">📚 Tất cả Môn học</option>';
        danhSachMonHoc.forEach(mh => {
            htmlMH += `<option value="${mh.maMH}">${mh.tenMH}</option>`;
        });
        filterMonHoc_Diem.innerHTML = htmlMH;
    }
}

// =============================================================
// 3. HỒ SƠ CÁ NHÂN & ĐỔI MẬT KHẨU
// =============================================================
function moModalProfile() {
    const u = danhSachUsers.find(item => item.username === currentUser.username) || currentUser;
    document.getElementById('profUsername').value = u.username;
    document.getElementById('profRole').value = u.role;
    document.getElementById('profHoTen').value = u.hoTen || u.name;
    document.getElementById('profEmail').value = u.email || '';
    document.getElementById('profOldPass').value = '';
    document.getElementById('profNewPass').value = '';
    document.getElementById('profConfirmPass').value = '';
    document.getElementById('modalProfile').style.display = 'flex';
}

// =============================================================
// 4. NHẬP / XUẤT EXCEL THỰC TẾ (SheetJS)
// =============================================================
function initExcelEvents() {
    const btnXuat = document.getElementById('btnXuatExcel');
    const btnNhap = document.getElementById('btnNhapExcel');
    const fileInput = document.getElementById('fileExcelInput');
    if (btnXuat) {
        btnXuat.onclick = () => {
            if (danhSachSinhVien.length === 0) return alert('Không có dữ liệu để xuất Excel!');
            const dataToExport = danhSachSinhVien.map((sv, idx) => ({
                "STT": idx + 1,
                "Mã SV": sv.maSV,
                "Họ và Tên": sv.hoTen,
                "Giới tính": sv.gioiTinh,
                "Ngày sinh": sv.ngaySinh,
                "Email": sv.email || '',
                "Khoa / Ngành": sv.khoa || '',
                "Lớp": sv.lop,
                "Trạng thái": sv.trangThai || 'Đang học'
            }));
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachSinhVien");
            XLSX.writeFile(workbook, `Danh_Sach_Sinh_Vien_${new Date().toISOString().slice(0,10)}.xlsx`);
        };
    }
    if (btnNhap && fileInput) {
        btnNhap.onclick = () => fileInput.click();
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    let countAdded = 0;
                    jsonData.forEach(item => {
                        const maSV = String(item['Mã SV'] || item['maSV'] || '').trim();
                        if (maSV && !danhSachSinhVien.some(sv => sv.maSV === maSV)) {
                            danhSachSinhVien.push({
                                maSV: maSV,
                                hoTen: item['Họ và Tên'] || item['hoTen'] || 'Chưa nhập',
                                gioiTinh: item['Giới tính'] || item['gioiTinh'] || 'Nam',
                                ngaySinh: item['Ngày sinh'] || item['ngaySinh'] || '2004-01-01',
                                email: item['Email'] || item['email'] || '',
                                khoa: item['Khoa / Ngành'] || item['khoa'] || 'Công nghệ thông tin',
                                lop: item['Lớp'] || item['lop'] || 'CNTT1',
                                trangThai: item['Trạng thái'] || item['trangThai'] || 'Đang học'
                            });
                            countAdded++;
                        }
                    });
                    luuTatCaData();
                    locDuLieu();
                    capNhatDashboard();
                    alert(`✅ Đã nhập thành công ${countAdded} sinh viên mới từ Excel!`);
                } catch (err) {
                    alert('⚠️ Tệp Excel không đúng định dạng!');
                }
                fileInput.value = '';
            };
            reader.readAsArrayBuffer(file);
        };
    }
}

// =============================================================
// 5. ĐIỀU HƯỚNG TAB
// =============================================================
function initTabSwitching() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        item.addEventListener('click', function() {
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            const tabTarget = this.getAttribute('data-tab');
            document.getElementById('section-dashboard').style.display = (tabTarget === 'dashboard') ? 'block' : 'none';
            document.getElementById('section-students').style.display = (tabTarget === 'students') ? 'block' : 'none';
            document.getElementById('section-classes').style.display = (tabTarget === 'classes') ? 'block' : 'none';
            document.getElementById('section-departments').style.display = (tabTarget === 'departments') ? 'block' : 'none';
            document.getElementById('section-users').style.display = (tabTarget === 'users') ? 'block' : 'none';
            document.getElementById('section-subjects').style.display = (tabTarget === 'subjects') ? 'block' : 'none';
            document.getElementById('section-registration').style.display = (tabTarget === 'registration') ? 'block' : 'none';
            document.getElementById('section-grades').style.display = (tabTarget === 'grades') ? 'block' : 'none';

            if (tabTarget === 'dashboard') capNhatDashboard();
            if (tabTarget === 'classes') renderBangLop();
            if (tabTarget === 'departments') renderBangKhoa();
            if (tabTarget === 'users') renderBangUser();
            if (tabTarget === 'subjects') renderBangMonHoc();
            if (tabTarget === 'registration') renderBangDangKyMon();
            if (tabTarget === 'grades') renderBangDiem();
        });
    });
}

// =============================================================
// 6. QUẢN LÝ TÀI KHOẢN
// =============================================================
function renderBangUser() {
    const tbody = document.getElementById('bang-tai-khoan');
    if (!tbody) return;
    tbody.innerHTML = '';
    danhSachUsers.forEach((u, idx) => {
        let badgeRole = 'background: rgba(79, 70, 229, 0.2); color: #818cf8;';
        if (u.role === 'Giảng viên') badgeRole = 'background: rgba(245, 158, 11, 0.2); color: #fbbf24;';
        if (u.role === 'Sinh viên') badgeRole = 'background: rgba(34, 197, 94, 0.2); color: #4ade80;';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight:bold; color:#60a5fa;">${u.username}</td>
            <td style="font-weight:600;">${u.hoTen}</td>
            <td style="color:var(--text-sub);">${u.email}</td>
            <td><span style="${badgeRole} padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: bold;">${u.role}</span></td>
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaUser(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaUser(${idx})">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function suaUser(idx) {
    const u = danhSachUsers[idx];
    document.getElementById('modalUserTitle').innerText = '✏️ Chỉnh Sửa Tài Khoản';
    document.getElementById('editUserIndex').value = idx;
    document.getElementById('inputUsername').value = u.username;
    document.getElementById('inputUsername').readOnly = true;
    document.getElementById('inputUserPassword').value = u.password;
    document.getElementById('inputUserHoTen').value = u.hoTen;
    document.getElementById('inputUserEmail').value = u.email;
    document.getElementById('selectUserRole').value = u.role;
    document.getElementById('modalUser').style.display = 'flex';
}

function xoaUser(idx) {
    if (confirm('🔒 Bạn có chắc chắn muốn xóa tài khoản này?')) {
        danhSachUsers.splice(idx, 1);
        luuTatCaData();
        renderBangUser();
    }
}

// =============================================================
// 7. QUẢN LÝ SINH VIÊN
// =============================================================
function locDuLieu() {
    const keyword = (document.getElementById('timKiemInput')?.value || '').toLowerCase();
    const khoaFilter = document.getElementById('filterKhoa')?.value || '';
    const lopFilter = document.getElementById('filterLop')?.value || '';

    const list = danhSachSinhVien.filter(sv => {
        const matchK = !keyword || sv.maSV.toLowerCase().includes(keyword) || sv.hoTen.toLowerCase().includes(keyword);
        const matchKhoa = !khoaFilter || sv.khoa === khoaFilter;
        const matchLop = !lopFilter || sv.lop === lopFilter;
        return matchK && matchKhoa && matchLop;
    });
    renderBang(list);
}

function renderBang(list = danhSachSinhVien) {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;
    tbody.innerHTML = '';

    list.forEach((sv) => {
        const globalIdx = danhSachSinhVien.findIndex(item => item.maSV === sv.maSV);
        let badgeClass = 'badge-danghoc';
        if (sv.trangThai === 'Bị cảnh báo') badgeClass = 'badge-canhbao';
        if (sv.trangThai === 'Đã tốt nghiệp') badgeClass = 'badge-totnghiep';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:center;"><input type="checkbox" class="checkSV" value="${sv.maSV}" onchange="capNhatXoaChon()"></td>
            <td style="font-weight:bold; color:#60a5fa;">${sv.maSV}</td>
            <td style="font-weight:600;">${sv.hoTen}</td>
            <td>${sv.gioiTinh}</td>
            <td style="color:var(--text-sub);">${sv.email || '-'}</td>
            <td>${sv.khoa || '-'}</td>
            <td>${sv.lop}</td>
            <td><span class="badge ${badgeClass}">${sv.trangThai}</span></td>
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaSinhVien(${globalIdx})">✏️</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaSinhVien(${globalIdx})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    apDungPhanQuyenRBAC();
}

function suaSinhVien(idx) {
    const sv = danhSachSinhVien[idx];
    document.getElementById('modalTitle').innerText = '✏️ Chỉnh Sửa Sinh Viên';
    document.getElementById('editIndex').value = idx;
    document.getElementById('inputMaSV').value = sv.maSV;
    document.getElementById('inputMaSV').readOnly = true;
    document.getElementById('inputHoTen').value = sv.hoTen;
    document.getElementById('selectGioiTinh').value = sv.gioiTinh;
    document.getElementById('inputNgaySinh').value = sv.ngaySinh;
    document.getElementById('inputEmail').value = sv.email || '';
    document.getElementById('selectTrangThai').value = sv.trangThai || 'Đang học';
    document.getElementById('selectKhoa').value = sv.khoa || '';
    document.getElementById('selectLop').value = sv.lop;
    document.getElementById('modalSinhVien').style.display = 'flex';
}

function xoaSinhVien(idx) {
    if (confirm('🗑️ Bạn có chắc chắn muốn xóa sinh viên này?')) {
        danhSachSinhVien.splice(idx, 1);
        luuTatCaData();
        locDuLieu();
        capNhatDashboard();
    }
}

function capNhatXoaChon() {
    const checked = document.querySelectorAll('.checkSV:checked');
    const btn = document.getElementById('btnXoaChon');
    const count = document.getElementById('countSelected');
    if (btn && count) {
        count.innerText = checked.length;
        btn.style.display = checked.length > 0 ? 'inline-flex' : 'none';
    }
}

// =============================================================
// 8. QUẢN LÝ LỚP HỌC & KHOA
// =============================================================
function renderBangLop() {
    const tbody = document.getElementById('bang-lop-hoc');
    if (!tbody) return;
    tbody.innerHTML = '';
    danhSachLop.forEach((l, idx) => {
        const siSo = danhSachSinhVien.filter(s => s.lop === l.maLop).length;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight:bold; color:#60a5fa;">${l.maLop}</td>
            <td style="font-weight:600;">${l.tenLop}</td>
            <td>${l.khoa}</td>
            <td><span class="badge badge-danghoc">${siSo} sinh viên</span></td>
            <td class="colHanhDongChung" style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaLop(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaLop(${idx})">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    apDungPhanQuyenRBAC();
}

function suaLop(idx) {
    const l = danhSachLop[idx];
    document.getElementById('modalLopTitle').innerText = '✏️ Chỉnh Sửa Lớp';
    document.getElementById('editLopIndex').value = idx;
    document.getElementById('inputMaLop').value = l.maLop;
    document.getElementById('inputMaLop').readOnly = true;
    document.getElementById('inputTenLop').value = l.tenLop;
    document.getElementById('selectKhoaForLop').value = l.khoa;
    document.getElementById('modalLop').style.display = 'flex';
}

function xoaLop(idx) {
    if (confirm('🗑️ Bạn có chắc chắn muốn xóa lớp này?')) {
        danhSachLop.splice(idx, 1);
        luuTatCaData();
        dongBoDropdownSelects();
        renderBangLop();
    }
}

function renderBangKhoa() {
    const tbody = document.getElementById('bang-khoa');
    if (!tbody) return;
    tbody.innerHTML = '';
    danhSachKhoa.forEach((k, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight:bold; color:#60a5fa;">${k.maKhoa}</td>
            <td style="font-weight:600;">${k.tenKhoa}</td>
            <td style="color:var(--text-sub);">${k.moTa}</td>
            <td class="colHanhDongChung" style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaKhoa(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaKhoa(${idx})">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    apDungPhanQuyenRBAC();
}

function suaKhoa(idx) {
    const k = danhSachKhoa[idx];
    document.getElementById('modalKhoaTitle').innerText = '✏️ Chỉnh Sửa Khoa';
    document.getElementById('editKhoaIndex').value = idx;
    document.getElementById('inputMaKhoa').value = k.maKhoa;
    document.getElementById('inputMaKhoa').readOnly = true;
    document.getElementById('inputTenKhoa').value = k.tenKhoa;
    document.getElementById('inputMoTaKhoa').value = k.moTa;
    document.getElementById('modalKhoa').style.display = 'flex';
}

function xoaKhoa(idx) {
    if (confirm('🗑️ Bạn có chắc chắn muốn xóa khoa này?')) {
        danhSachKhoa.splice(idx, 1);
        luuTatCaData();
        dongBoDropdownSelects();
        renderBangKhoa();
    }
}

// =============================================================
// 9. QUẢN LÝ MÔN HỌC & ĐĂNG KÝ TÍN CHỈ
// =============================================================
function renderBangMonHoc() {
    const tbody = document.getElementById('bang-mon-hoc');
    if (!tbody) return;
    tbody.innerHTML = '';
    danhSachMonHoc.forEach((mh, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:bold; color:#60a5fa;">${mh.maMH}</td>
            <td style="font-weight:600;">${mh.tenMH}</td>
            <td><span class="badge badge-totnghiep">${mh.tinChi} Tín chỉ</span></td>
            <td>${mh.loaiMon}</td>
            <td class="colHanhDongChung" style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaMonHoc(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaMonHoc(${idx})">🗑️ Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    apDungPhanQuyenRBAC();
}

function suaMonHoc(idx) {
    const mh = danhSachMonHoc[idx];
    document.getElementById('modalMonHocTitle').innerText = '✏️ Chỉnh Sửa Môn Học';
    document.getElementById('editMonHocIndex').value = idx;
    document.getElementById('inputMaMH').value = mh.maMH;
    document.getElementById('inputMaMH').readOnly = true;
    document.getElementById('inputTenMH').value = mh.tenMH;
    document.getElementById('inputTinChi').value = mh.tinChi;
    document.getElementById('selectLoaiMon').value = mh.loaiMon;
    document.getElementById('modalMonHoc').style.display = 'flex';
}

function xoaMonHoc(idx) {
    if (confirm('🗑️ Bạn có chắc chắn muốn xóa môn học này?')) {
        danhSachMonHoc.splice(idx, 1);
        luuTatCaData();
        renderBangMonHoc();
        dongBoDropdownSelects();
    }
}

function renderBangDangKyMon() {
    const tbody = document.getElementById('bang-dang-ky-mon');
    if (!tbody) return;
    tbody.innerHTML = '';
    const kw = (document.getElementById('timKiemMonHoc')?.value || '').toLowerCase();
    
    let tongTC = 0;
    danhSachMonHoc.forEach((mh) => {
        if (kw && !mh.maMH.toLowerCase().includes(kw) && !mh.tenMH.toLowerCase().includes(kw)) return;

        const isChecked = danhSachDangKy.includes(mh.maMH);
        if (isChecked) tongTC += Number(mh.tinChi);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:center;">
                <input type="checkbox" value="${mh.maMH}" ${isChecked ? 'checked' : ''} onchange="tinhTongTinChi()">
            </td>
            <td style="font-weight:bold; color:#60a5fa;">${mh.maMH}</td>
            <td style="font-weight:600;">${mh.tenMH}</td>
            <td>${mh.tinChi}</td>
            <td>${mh.loaiMon}</td>
        `;
        tbody.appendChild(tr);
    });
    document.getElementById('tongTinChi').innerText = tongTC;
}

function tinhTongTinChi() {
    const checkboxes = document.querySelectorAll('#bang-dang-ky-mon input[type="checkbox"]:checked');
    let total = 0;
    checkboxes.forEach(cb => {
        const mh = danhSachMonHoc.find(m => m.maMH === cb.value);
        if (mh) total += Number(mh.tinChi);
    });
    document.getElementById('tongTinChi').innerText = total;
}

// =============================================================
// 10. QUẢN LÝ BẢNG ĐIỂM & TÍNH ĐIỂM GPA
// =============================================================
function renderBangDiem() {
    const tbody = document.getElementById('bang-diem-chi-tiet');
    if (!tbody) return;
    tbody.innerHTML = '';

    const filterSV = (document.getElementById('timKiemSV_Diem')?.value || '').toLowerCase();
    const filterMH = document.getElementById('filterMonHoc_Diem')?.value || '';

    let tongDiemNhanTinChi = 0;
    let tongSoTinChi = 0;

    danhSachDiem.forEach((d, idx) => {
        if (filterSV && !d.maSV.toLowerCase().includes(filterSV)) return;
        if (filterMH && d.maMH !== filterMH) return;

        const sv = danhSachSinhVien.find(s => s.maSV === d.maSV) || { hoTen: 'Sinh viên ' + d.maSV };
        const mh = danhSachMonHoc.find(m => m.maMH === d.maMH) || { tenMH: d.maMH, tinChi: 3 };

        const tongKet = (Number(d.diemQT) * 0.3 + Number(d.diemThi) * 0.7).toFixed(1);
        
        let diemChu = 'F';
        let diemHe4 = 0.0;
        if (tongKet >= 8.5) { diemChu = 'A'; diemHe4 = 4.0; }
        else if (tongKet >= 7.0) { diemChu = 'B'; diemHe4 = 3.0; }
        else if (tongKet >= 5.5) { diemChu = 'C'; diemHe4 = 2.0; }
        else if (tongKet >= 4.0) { diemChu = 'D'; diemHe4 = 1.0; }

        tongDiemNhanTinChi += diemHe4 * mh.tinChi;
        tongSoTinChi += Number(mh.tinChi);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:bold; color:#60a5fa;">${d.maSV}</td>
            <td style="font-weight:600;">${sv.hoTen}</td>
            <td>${mh.tenMH}</td>
            <td>${d.diemQT}</td>
            <td>${d.diemThi}</td>
            <td style="font-weight:bold; color:#34d399;">${tongKet}</td>
            <td><span class="badge ${diemChu === 'F' ? 'badge-canhbao' : 'badge-danghoc'}">${diemChu}</span></td>
        `;
        tbody.appendChild(tr);
    });

    const gpa = tongSoTinChi > 0 ? (tongDiemNhanTinChi / tongSoTinChi).toFixed(2) : '0.00';
    if (document.getElementById('statGPA')) document.getElementById('statGPA').innerText = gpa;
}

// =============================================================
// 11. DASHBOARD BÁO CÁO THỐNG KÊ (CHART.JS)
// =============================================================
function capNhatDashboard() {
    const total = danhSachSinhVien.length;
    const active = danhSachSinhVien.filter(s => s.trangThai === 'Đang học').length;
    const warning = danhSachSinhVien.filter(s => s.trangThai === 'Bị cảnh báo').length;
    const graduated = danhSachSinhVien.filter(s => s.trangThai === 'Đã tốt nghiệp').length;

    if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = total;
    if (document.getElementById('statActive')) document.getElementById('statActive').innerText = active;
    if (document.getElementById('statWarning')) document.getElementById('statWarning').innerText = warning;
    if (document.getElementById('statGraduated')) document.getElementById('statGraduated').innerText = graduated;

    // Thống kê theo Lớp
    const classCounts = {};
    danhSachSinhVien.forEach(s => {
        classCounts[s.lop] = (classCounts[s.lop] || 0) + 1;
    });

    const classLabels = Object.keys(classCounts);
    const classData = Object.values(classCounts);

    const ctxClass = document.getElementById('chartClass');
    if (ctxClass) {
        if (chartClassInstance) chartClassInstance.destroy();
        chartClassInstance = new Chart(ctxClass, {
            type: 'bar',
            data: {
                labels: classLabels.length ? classLabels : ['Chưa có lớp'],
                datasets: [{
                    label: 'Số lượng sinh viên',
                    data: classData.length ? classData : [0],
                    backgroundColor: '#4f46e5',
                    borderRadius: 6
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // Thống kê Giới tính
    const nam = danhSachSinhVien.filter(s => s.gioiTinh === 'Nam').length;
    const nu = danhSachSinhVien.filter(s => s.gioiTinh === 'Nữ').length;

    const ctxGender = document.getElementById('chartGender');
    if (ctxGender) {
        if (chartGenderInstance) chartGenderInstance.destroy();
        chartGenderInstance = new Chart(ctxGender, {
            type: 'doughnut',
            data: {
                labels: ['Nam', 'Nữ'],
                datasets: [{
                    data: [nam, nu],
                    backgroundColor: ['#38bdf8', '#ec4899']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

// =============================================================
// 12. SỰ KIỆN CÁC FORM VÀ NÚT BẤM
// =============================================================
function initFormListeners() {
    // Form Tài Khoản
    document.getElementById('btnThemUser').onclick = () => {
        document.getElementById('modalUserTitle').innerText = '➕ Thêm Tài Khoản Mới';
        document.getElementById('editUserIndex').value = '-1';
        document.getElementById('inputUsername').readOnly = false;
        document.getElementById('formUser').reset();
        document.getElementById('modalUser').style.display = 'flex';
    };

    document.getElementById('formUser').onsubmit = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('editUserIndex').value);
        const username = document.getElementById('inputUsername').value.trim();
        const password = document.getElementById('inputUserPassword').value.trim();
        const hoTen = document.getElementById('inputUserHoTen').value.trim();
        const email = document.getElementById('inputUserEmail').value.trim();
        const role = document.getElementById('selectUserRole').value;

        if (idx === -1) {
            if (danhSachUsers.some(u => u.username === username)) return alert('⚠️ Tên đăng nhập đã tồn tại!');
            danhSachUsers.push({ username, password, hoTen, email, role });
        } else {
            danhSachUsers[idx] = { username, password, hoTen, email, role };
        }
        luuTatCaData();
        renderBangUser();
        dongModal('modalUser');
    };

    // Form Hồ sơ
    document.getElementById('formProfile').onsubmit = (e) => {
        e.preventDefault();
        const uIdx = danhSachUsers.findIndex(item => item.username === currentUser.username);
        if (uIdx === -1) return;

        const newHoTen = document.getElementById('profHoTen').value.trim();
        const newEmail = document.getElementById('profEmail').value.trim();
        const oldPass = document.getElementById('profOldPass').value.trim();
        const newPass = document.getElementById('profNewPass').value.trim();
        const confirmPass = document.getElementById('profConfirmPass').value.trim();

        if (oldPass || newPass || confirmPass) {
            if (oldPass !== danhSachUsers[uIdx].password) return alert('⚠️ Mật khẩu hiện tại không chính xác!');
            if (newPass.length < 6) return alert('⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!');
            if (newPass !== confirmPass) return alert('⚠️ Mật khẩu xác nhận không khớp!');
            danhSachUsers[uIdx].password = newPass;
        }
        danhSachUsers[uIdx].hoTen = newHoTen;
        danhSachUsers[uIdx].email = newEmail;
        currentUser.name = newHoTen;
        currentUser.email = newEmail;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        luuTatCaData();
        capNhatUIUserInfo();
        dongModal('modalProfile');
        alert('🎉 Cập nhật thông tin thành công!');
    };

    // Form Sinh Viên
    document.getElementById('btnThemSV').onclick = () => {
        document.getElementById('modalTitle').innerText = '➕ Thêm Sinh Viên Mới';
        document.getElementById('editIndex').value = '-1';
        document.getElementById('inputMaSV').readOnly = false;
        document.getElementById('formSinhVien').reset();
        document.getElementById('modalSinhVien').style.display = 'flex';
    };

    document.getElementById('formSinhVien').onsubmit = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('editIndex').value);
        const maSV = document.getElementById('inputMaSV').value.trim();
        const hoTen = document.getElementById('inputHoTen').value.trim();
        const gioiTinh = document.getElementById('selectGioiTinh').value;
        const ngaySinh = document.getElementById('inputNgaySinh').value;
        const email = document.getElementById('inputEmail').value.trim();
        const trangThai = document.getElementById('selectTrangThai').value;
        const khoa = document.getElementById('selectKhoa').value;
        const lop = document.getElementById('selectLop').value;

        if (idx === -1) {
            if (danhSachSinhVien.some(s => s.maSV === maSV)) return alert('⚠️ Mã sinh viên này đã tồn tại!');
            danhSachSinhVien.push({ maSV, hoTen, gioiTinh, ngaySinh, email, trangThai, khoa, lop });
        } else {
            danhSachSinhVien[idx] = { maSV, hoTen, gioiTinh, ngaySinh, email, trangThai, khoa, lop };
        }
        luuTatCaData();
        locDuLieu();
        capNhatDashboard();
        dongModal('modalSinhVien');
    };

    // Form Khoa
    document.getElementById('btnThemKhoa').onclick = () => {
        document.getElementById('modalKhoaTitle').innerText = '➕ Thêm Khoa Mới';
        document.getElementById('editKhoaIndex').value = '-1';
        document.getElementById('inputMaKhoa').readOnly = false;
        document.getElementById('formKhoa').reset();
        document.getElementById('modalKhoa').style.display = 'flex';
    };

    document.getElementById('formKhoa').onsubmit = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('editKhoaIndex').value);
        const maKhoa = document.getElementById('inputMaKhoa').value.trim();
        const tenKhoa = document.getElementById('inputTenKhoa').value.trim();
        const moTa = document.getElementById('inputMoTaKhoa').value.trim();

        if (idx === -1) {
            if (danhSachKhoa.some(k => k.maKhoa === maKhoa)) return alert('⚠️ Mã khoa đã tồn tại!');
            danhSachKhoa.push({ maKhoa, tenKhoa, moTa });
        } else {
            danhSachKhoa[idx] = { maKhoa, tenKhoa, moTa };
        }
        luuTatCaData();
        dongBoDropdownSelects();
        renderBangKhoa();
        dongModal('modalKhoa');
    };

    // Form Lớp
    document.getElementById('btnThemLop').onclick = () => {
        document.getElementById('modalLopTitle').innerText = '➕ Thêm Lớp Mới';
        document.getElementById('editLopIndex').value = '-1';
        document.getElementById('inputMaLop').readOnly = false;
        document.getElementById('formLop').reset();
        document.getElementById('modalLop').style.display = 'flex';
    };

    document.getElementById('formLop').onsubmit = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('editLopIndex').value);
        const maLop = document.getElementById('inputMaLop').value.trim();
        const tenLop = document.getElementById('inputTenLop').value.trim();
        const khoa = document.getElementById('selectKhoaForLop').value;

        if (idx === -1) {
            if (danhSachLop.some(l => l.maLop === maLop)) return alert('⚠️ Mã lớp đã tồn tại!');
            danhSachLop.push({ maLop, tenLop, khoa });
        } else {
            danhSachLop[idx] = { maLop, tenLop, khoa };
        }
        luuTatCaData();
        dongBoDropdownSelects();
        renderBangLop();
        dongModal('modalLop');
    };

    // Form Môn Học
    document.getElementById('btnThemMonHoc').onclick = () => {
        document.getElementById('modalMonHocTitle').innerText = '➕ Thêm Môn Học Mới';
        document.getElementById('editMonHocIndex').value = '-1';
        document.getElementById('inputMaMH').readOnly = false;
        document.getElementById('formMonHoc').reset();
        document.getElementById('modalMonHoc').style.display = 'flex';
    };

    document.getElementById('formMonHoc').onsubmit = (e) => {
        e.preventDefault();
        const idx = parseInt(document.getElementById('editMonHocIndex').value);
        const maMH = document.getElementById('inputMaMH').value.trim();
        const tenMH = document.getElementById('inputTenMH').value.trim();
        const tinChi = Number(document.getElementById('inputTinChi').value);
        const loaiMon = document.getElementById('selectLoaiMon').value;

        if (idx === -1) {
            if (danhSachMonHoc.some(m => m.maMH === maMH)) return alert('⚠️ Mã môn học đã tồn tại!');
            danhSachMonHoc.push({ maMH, tenMH, tinChi, loaiMon });
        } else {
            danhSachMonHoc[idx] = { maMH, tenMH, tinChi, loaiMon };
        }
        luuTatCaData();
        renderBangMonHoc();
        dongBoDropdownSelects();
        dongModal('modalMonHoc');
    };

    // Form Cập nhật Điểm
    document.getElementById('btnNhapDiem').onclick = () => {
        document.getElementById('formNhapDiem').reset();
        document.getElementById('modalNhapDiem').style.display = 'flex';
    };

    document.getElementById('formNhapDiem').onsubmit = (e) => {
        e.preventDefault();
        const maSV = document.getElementById('inputDiemSV').value.trim();
        const maMH = document.getElementById('inputDiemMH').value.trim();
        const diemQT = parseFloat(document.getElementById('inputDiemQT').value);
        const diemThi = parseFloat(document.getElementById('inputDiemThi').value);

        const existingIdx = danhSachDiem.findIndex(d => d.maSV === maSV && d.maMH === maMH);
        if (existingIdx !== -1) {
            danhSachDiem[existingIdx] = { maSV, maMH, diemQT, diemThi };
        } else {
            danhSachDiem.push({ maSV, maMH, diemQT, diemThi });
        }
        luuTatCaData();
        renderBangDiem();
        dongModal('modalNhapDiem');
    };

    // Lưu Đăng Ký Môn
    document.getElementById('btnLuuDangKy').onclick = () => {
        const checkboxes = document.querySelectorAll('#bang-dang-ky-mon input[type="checkbox"]:checked');
        danhSachDangKy = Array.from(checkboxes).map(cb => cb.value);
        luuTatCaData();
        alert('🎉 Đã lưu danh sách môn học đăng ký thành công!');
    };

    // Tìm kiếm và Lọc
    document.getElementById('timKiemInput')?.addEventListener('input', locDuLieu);
    document.getElementById('filterKhoa')?.addEventListener('change', locDuLieu);
    document.getElementById('filterLop')?.addEventListener('change', locDuLieu);
    document.getElementById('timKiemMonHoc')?.addEventListener('input', renderBangDangKyMon);
    document.getElementById('timKiemSV_Diem')?.addEventListener('input', renderBangDiem);
    document.getElementById('filterMonHoc_Diem')?.addEventListener('change', renderBangDiem);

    // Chọn tất cả SV & Xóa
    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.onclick = function() {
            document.querySelectorAll('.checkSV').forEach(cb => cb.checked = this.checked);
            capNhatXoaChon();
        };
    }

    document.getElementById('btnXoaChon').onclick = () => {
        const checked = document.querySelectorAll('.checkSV:checked');
        if (confirm(`🗑️ Bạn có chắc muốn xóa ${checked.length} sinh viên đã chọn?`)) {
            const listMaSV = Array.from(checked).map(cb => cb.value);
            danhSachSinhVien = danhSachSinhVien.filter(sv => !listMaSV.includes(sv.maSV));
            luuTatCaData();
            locDuLieu();
            capNhatDashboard();
            document.getElementById('btnXoaChon').style.display = 'none';
        }
    };

    // In Bảng Điểm PDF
    document.getElementById('btnInBangDiem').onclick = () => {
        window.print();
    };
}