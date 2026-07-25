// =============================================================
// 1. KIỂM TRA SESSION ĐĂNG NHẬP
// =============================================================
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

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

let danhSachUsers = JSON.parse(localStorage.getItem('danhSachUsers')) || defaultUsers;
let danhSachKhoa = JSON.parse(localStorage.getItem('danhSachKhoa')) || defaultKhoa;
let danhSachLop = JSON.parse(localStorage.getItem('danhSachLop')) || defaultLop;
let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien')) || defaultStudents;

function luuTatCaData() {
    localStorage.setItem('danhSachUsers', JSON.stringify(danhSachUsers));
    localStorage.setItem('danhSachKhoa', JSON.stringify(danhSachKhoa));
    localStorage.setItem('danhSachLop', JSON.stringify(danhSachLop));
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
}

// =============================================================
// 2. KHỞI TẠO VÀ PHÂN QUYỀN HỆ THỐNG
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    capNhatUIUserInfo();

    document.getElementById('btnLogout').onclick = () => {
        if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    };

    // Bấm vào User Info góc phải để mở Modal Hồ Sơ
    const elUserInfo = document.querySelector('.user-info');
    if (elUserInfo) {
        elUserInfo.style.cursor = 'pointer';
        elUserInfo.title = 'Bấm để xem hồ sơ / đổi mật khẩu';
        elUserInfo.onclick = moModalProfile;
    }

    apDungPhanQuyenRBAC();
    dongBoDropdownSelects();
    initTabSwitching();
    renderBang();
    renderBangLop();
    renderBangKhoa();
    renderBangUser();
    capNhatDashboard();
    initExcelEvents();
});

function capNhatUIUserInfo() {
    if (document.getElementById('userName')) document.getElementById('userName').innerText = currentUser.name;
    if (document.getElementById('userRole')) document.getElementById('userRole').innerText = currentUser.role.toUpperCase();
    if (document.getElementById('userAvatar')) document.getElementById('userAvatar').innerText = currentUser.name.charAt(0).toUpperCase();
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

document.getElementById('formProfile').onsubmit = (e) => {
    e.preventDefault();
    const uIdx = danhSachUsers.findIndex(item => item.username === currentUser.username);
    if (uIdx === -1) return;

    const newHoTen = document.getElementById('profHoTen').value.trim();
    const newEmail = document.getElementById('profEmail').value.trim();
    const oldPass = document.getElementById('profOldPass').value.trim();
    const newPass = document.getElementById('profNewPass').value.trim();
    const confirmPass = document.getElementById('profConfirmPass').value.trim();

    // Nếu đổi mật khẩu
    if (oldPass || newPass || confirmPass) {
        if (oldPass !== danhSachUsers[uIdx].password) {
            return alert('⚠️ Mật khẩu hiện tại không chính xác!');
        }
        if (newPass.length < 6) {
            return alert('⚠️ Mật khẩu mới phải có ít nhất 6 ký tự!');
        }
        if (newPass !== confirmPass) {
            return alert('⚠️ Mật khẩu xác nhận không khớp!');
        }
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

            if (tabTarget === 'dashboard') capNhatDashboard();
            if (tabTarget === 'classes') renderBangLop();
            if (tabTarget === 'departments') renderBangKhoa();
            if (tabTarget === 'users') renderBangUser();
        });
    });
}

// =============================================================
// 6. QUẢN LÝ TÀI KHOẢN (Chỉ Admin)
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

document.getElementById('btnThemUser').onclick = () => {
    document.getElementById('modalUserTitle').innerText = '➕ Thêm Tài Khoản Mới';
    document.getElementById('editUserIndex').value = '-1';
    document.getElementById('inputUsername').readOnly = false;
    document.getElementById('formUser').reset();
    document.getElementById('modalUser').style.display = 'flex';
};

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

document.getElementById('formUser').onsubmit = (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('editUserIndex').value);
    const userObj = {
        username: document.getElementById('inputUsername').value.trim(),
        password: document.getElementById('inputUserPassword').value.trim(),
        hoTen: document.getElementById('inputUserHoTen').value.trim(),
        email: document.getElementById('inputUserEmail').value.trim(),
        role: document.getElementById('selectUserRole').value
    };

    if (idx === -1) {
        if (danhSachUsers.some(u => u.username === userObj.username)) return alert('Tên đăng nhập đã tồn tại!');
        danhSachUsers.push(userObj);
    } else {
        danhSachUsers[idx] = userObj;
    }

    luuTatCaData();
    renderBangUser();
    dongModal('modalUser');
};

function xoaUser(idx) {
    if (danhSachUsers[idx].username === currentUser.username) return alert('⚠️ Bạn không thể xóa tài khoản đang đăng nhập!');
    if (confirm(`🗑️ Xóa tài khoản ${danhSachUsers[idx].username}?`)) {
        danhSachUsers.splice(idx, 1);
        luuTatCaData();
        renderBangUser();
    }
}

// =============================================================
// 7. QUẢN LÝ KHOA & LỚP
// =============================================================
function renderBangKhoa() {
    const tbody = document.getElementById('bang-khoa');
    if (!tbody) return;
    tbody.innerHTML = '';

    danhSachKhoa.forEach((k, idx) => {
        let colAction = (currentUser.role === 'Admin') ? `
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaKhoa(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaKhoa(${idx})">🗑️ Xóa</button>
            </td>` : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx + 1}</td><td style="font-weight:bold; color:#60a5fa;">${k.maKhoa}</td><td style="font-weight:600;">${k.tenKhoa}</td><td style="color:var(--text-sub);">${k.moTa || '—'}</td>${colAction}`;
        tbody.appendChild(tr);
    });
}

function renderBangLop() {
    const tbody = document.getElementById('bang-lop-hoc');
    if (!tbody) return;
    tbody.innerHTML = '';

    danhSachLop.forEach((l, idx) => {
        const siSo = danhSachSinhVien.filter(sv => sv.lop === l.maLop).length;
        let colAction = (currentUser.role === 'Admin') ? `
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaLop(${idx})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaLop(${idx})">🗑️ Xóa</button>
            </td>` : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${idx + 1}</td><td style="font-weight:bold; color:#60a5fa;">${l.maLop}</td><td style="font-weight:600;">${l.tenLop}</td><td>${l.khoa}</td><td><span style="background:rgba(59,130,246,0.2); color:#60a5fa; padding:2px 8px; border-radius:12px; font-weight:bold;">${siSo} SV</span></td>${colAction}`;
        tbody.appendChild(tr);
    });
}

document.getElementById('btnThemKhoa').onclick = () => {
    document.getElementById('modalKhoaTitle').innerText = '➕ Thêm Khoa Mới';
    document.getElementById('editKhoaIndex').value = '-1';
    document.getElementById('inputMaKhoa').readOnly = false;
    document.getElementById('formKhoa').reset();
    document.getElementById('modalKhoa').style.display = 'flex';
};

function suaKhoa(idx) {
    const k = danhSachKhoa[idx];
    document.getElementById('modalKhoaTitle').innerText = '✏️ Chỉnh Sửa Khoa';
    document.getElementById('editKhoaIndex').value = idx;
    document.getElementById('inputMaKhoa').value = k.maKhoa;
    document.getElementById('inputMaKhoa').readOnly = true;
    document.getElementById('inputTenKhoa').value = k.tenKhoa;
    document.getElementById('inputMoTaKhoa').value = k.moTa || '';
    document.getElementById('modalKhoa').style.display = 'flex';
}

document.getElementById('formKhoa').onsubmit = (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('editKhoaIndex').value);
    const khoaObj = { maKhoa: document.getElementById('inputMaKhoa').value.trim(), tenKhoa: document.getElementById('inputTenKhoa').value.trim(), moTa: document.getElementById('inputMoTaKhoa').value.trim() };
    if (idx === -1) { if (danhSachKhoa.some(k => k.maKhoa === khoaObj.maKhoa)) return alert('Mã Khoa đã tồn tại!'); danhSachKhoa.push(khoaObj); } 
    else { danhSachKhoa[idx] = khoaObj; }
    luuTatCaData(); dongBoDropdownSelects(); renderBangKhoa(); dongModal('modalKhoa');
};

function xoaKhoa(idx) {
    if (confirm(`🗑️ Xóa khoa ${danhSachKhoa[idx].tenKhoa}?`)) { danhSachKhoa.splice(idx, 1); luuTatCaData(); dongBoDropdownSelects(); renderBangKhoa(); }
}

document.getElementById('btnThemLop').onclick = () => {
    document.getElementById('modalLopTitle').innerText = '➕ Thêm Lớp Mới';
    document.getElementById('editLopIndex').value = '-1';
    document.getElementById('inputMaLop').readOnly = false;
    document.getElementById('formLop').reset();
    document.getElementById('modalLop').style.display = 'flex';
};

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

document.getElementById('formLop').onsubmit = (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('editLopIndex').value);
    const lopObj = { maLop: document.getElementById('inputMaLop').value.trim(), tenLop: document.getElementById('inputTenLop').value.trim(), khoa: document.getElementById('selectKhoaForLop').value };
    if (idx === -1) { if (danhSachLop.some(l => l.maLop === lopObj.maLop)) return alert('Mã Lớp đã tồn tại!'); danhSachLop.push(lopObj); } 
    else { danhSachLop[idx] = lopObj; }
    luuTatCaData(); dongBoDropdownSelects(); renderBangLop(); dongModal('modalLop');
};

function xoaLop(idx) {
    if (confirm(`🗑️ Xóa lớp ${danhSachLop[idx].tenLop}?`)) { danhSachLop.splice(idx, 1); luuTatCaData(); dongBoDropdownSelects(); renderBangLop(); }
}

// =============================================================
// 8. QUẢN LÝ SINH VIÊN
// =============================================================
function renderBang(data = danhSachSinhVien) {
    const tbody = document.getElementById('bang-sinh-vien');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 20px; color: #94a3b8;">Không tìm thấy sinh viên nào!</td></tr>`;
        return;
    }

    const isSinhVien = currentUser.role === 'Sinh viên';
    const isGiangVien = currentUser.role === 'Giảng viên';

    data.forEach((sv) => {
        const indexGoc = danhSachSinhVien.findIndex(item => item.maSV === sv.maSV);

        const colCheckbox = (!isSinhVien && !isGiangVien) 
            ? `<td style="text-align: center;"><input type="checkbox" class="check-item" data-index="${indexGoc}" onchange="capNhatNutXoaChon()"></td>` : '';

        let colActions = '';
        if (currentUser.role === 'Admin') {
            colActions = `<td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaSinhVien(${indexGoc})">✏️ Sửa</button>
                <button style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="xoaSinhVien(${indexGoc})">🗑️ Xóa</button>
            </td>`;
        } else if (currentUser.role === 'Giảng viên') {
            colActions = `<td style="text-align: right;">
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
        const khopKhoa = khoaChon === '' || (sv.khoa || '') === khoaChon;
        const khopLop = lopChon === '' || sv.lop === lopChon;
        return khopTuKhoa && khopKhoa && khopLop;
    });

    renderBang(ketQua);
}

document.getElementById('timKiemInput')?.addEventListener('input', locDuLieu);
document.getElementById('filterKhoa')?.addEventListener('change', locDuLieu);
document.getElementById('filterLop')?.addEventListener('change', locDuLieu);

document.getElementById('btnThemSV').onclick = () => {
    document.getElementById('modalTitle').innerText = '➕ Thêm Sinh Viên Mới';
    document.getElementById('editIndex').value = '-1';
    document.getElementById('inputMaSV').readOnly = false;
    document.getElementById('formSinhVien').reset();
    document.getElementById('modalSinhVien').style.display = 'flex';
};

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
    document.getElementById('selectKhoa').value = sv.khoa || '';
    document.getElementById('selectLop').value = sv.lop;
    document.getElementById('selectTrangThai').value = sv.trangThai || 'Đang học';
    document.getElementById('modalSinhVien').style.display = 'flex';
}

document.getElementById('formSinhVien').onsubmit = (e) => {
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
        if (danhSachSinhVien.some(sv => sv.maSV === studentData.maSV)) return alert('⚠️ Mã Sinh Viên đã tồn tại!');
        danhSachSinhVien.push(studentData);
    } else {
        danhSachSinhVien[index] = studentData;
    }

    luuTatCaData();
    locDuLieu();
    capNhatDashboard();
    dongModal('modalSinhVien');
};

function xoaSinhVien(index) {
    if (confirm(`🗑️ Xóa sinh viên ${danhSachSinhVien[index].hoTen}?`)) {
        danhSachSinhVien.splice(index, 1);
        luuTatCaData();
        locDuLieu();
        capNhatDashboard();
    }
}

// Xóa chọn hàng loạt
const checkAllInput = document.getElementById('checkAll');
if (checkAllInput) {
    checkAllInput.addEventListener('change', function() {
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
        btnXoaChon.style.display = selectedBoxes.length > 0 ? 'inline-block' : 'none';
        if (countSpan) countSpan.innerText = selectedBoxes.length;
    }
}

const btnXoaChon = document.getElementById('btnXoaChon');
if (btnXoaChon) {
    btnXoaChon.onclick = () => {
        const selectedBoxes = document.querySelectorAll('.check-item:checked');
        if (selectedBoxes.length === 0) return;

        if (confirm(`🗑️ Bạn có chắc muốn xóa ${selectedBoxes.length} sinh viên đã chọn?`)) {
            const indexesToDelete = Array.from(selectedBoxes).map(cb => parseInt(cb.getAttribute('data-index')));
            danhSachSinhVien = danhSachSinhVien.filter((_, idx) => !indexesToDelete.includes(idx));
            if (checkAllInput) checkAllInput.checked = false;
            luuTatCaData();
            locDuLieu();
            capNhatDashboard();
        }
    };
}

// =============================================================
// 9. DASHBOARD CHARTS
// =============================================================
let chartClassInstance = null;
let chartGenderInstance = null;

function capNhatDashboard() {
    const total = danhSachSinhVien.length;
    const activeCount = danhSachSinhVien.filter(sv => (sv.trangThai || 'Đang học') === 'Đang học').length;
    const warningCount = danhSachSinhVien.filter(sv => sv.trangThai === 'Bị cảnh báo').length;
    const graduatedCount = danhSachSinhVien.filter(sv => sv.trangThai === 'Đã tốt nghiệp').length;

    if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = total;
    if (document.getElementById('statActive')) document.getElementById('statActive').innerText = activeCount;
    if (document.getElementById('statWarning')) document.getElementById('statWarning').innerText = warningCount;
    if (document.getElementById('statGraduated')) document.getElementById('statGraduated').innerText = graduatedCount;

    const classCounts = {};
    danhSachSinhVien.forEach(sv => classCounts[sv.lop] = (classCounts[sv.lop] || 0) + 1);

    const elChartClass = document.getElementById('chartClass');
    if (elChartClass) {
        const ctxClass = elChartClass.getContext('2d');
        if (chartClassInstance) chartClassInstance.destroy();
        chartClassInstance = new Chart(ctxClass, {
            type: 'bar',
            data: { labels: Object.keys(classCounts), datasets: [{ label: 'Số sinh viên', data: Object.values(classCounts), backgroundColor: '#3b82f6', borderRadius: 6 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }, x: { ticks: { color: '#94a3b8' }, grid: { display: false } } } }
        });
    }

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