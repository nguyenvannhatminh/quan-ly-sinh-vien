// =============================================================
// 1. DATA KHO BAN ĐẦU & LOCAL STORAGE
// =============================================================
const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'Admin User', role: 'Admin', username: 'admin' };

const defaultUsers = [
    { username: 'admin', password: '123456', hoTen: 'Quản trị viên', email: 'admin@truong.edu.vn', role: 'Admin' },
    { username: 'giangvien', password: '123456', hoTen: 'ThS. Nguyễn Văn A', email: 'gv.nguyenvana@truong.edu.vn', role: 'Giảng viên' },
    { username: 'sinhvien', password: '123456', hoTen: 'Trần Văn B', email: 'sv.tranvanb@truong.edu.vn', role: 'Sinh viên' }
];
const defaultKhoa = [
    { maKhoa: 'CNTT', tenKhoa: 'Công nghệ thông tin', moTa: 'Đào tạo kỹ sư phần mềm, AI' },
    { maKhoa: 'KT', tenKhoa: 'Kinh tế', moTa: 'Đào tạo quản trị kinh doanh, kế toán' }
];
const defaultLop = [
    { maLop: 'CNTT1', tenLop: 'Công nghệ thông tin 1', khoa: 'Công nghệ thông tin' },
    { maLop: 'KT1', tenLop: 'Kinh tế 1', khoa: 'Kinh tế' }
];
const defaultStudents = [
    { maSV: 'SV001', hoTen: 'Nguyễn Văn Anh', gioiTinh: 'Nam', ngaySinh: '2004-05-12', email: 'anh.nv@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Đang học' },
    { maSV: 'SV002', hoTen: 'Trần Thị Bảo', gioiTinh: 'Nữ', ngaySinh: '2004-08-20', email: 'bao.tt@gmail.com', khoa: 'Công nghệ thông tin', lop: 'CNTT1', trangThai: 'Bị cảnh báo' }
];
const defaultMonHoc = [
    { maMH: 'INT1001', tenMH: 'Cấu trúc dữ liệu & Giải thuật', tinChi: 3, loaiMon: 'Bắt buộc' },
    { maMH: 'INT1002', tenMH: 'Lập trình Web Cơ bản', tinChi: 3, loaiMon: 'Bắt buộc' }
];
const defaultDiem = [
    { maSV: 'SV001', maMH: 'INT1001', diemQT: 8.5, diemThi: 8.0 },
    { maSV: 'SV001', maMH: 'INT1002', diemQT: 9.0, diemThi: 8.5 }
];

// DATA MẶC ĐỊNH CHO MODULE 3 (Thời khóa biểu, Lịch thi, Thông báo)
const defaultSchedule = [
    { thu: 'Thứ 2', gio: '07:30 - 09:30', maMH: 'INT1001', tenMH: 'Cấu trúc dữ liệu & Giải thuật', phong: 'A2-301', gv: 'ThS. Nguyễn Văn A' },
    { thu: 'Thứ 4', gio: '09:30 - 11:30', maMH: 'INT1002', tenMH: 'Lập trình Web Cơ bản', phong: 'B1-102', gv: 'TS. Trần Minh C' },
    { thu: 'Thứ 6', gio: '13:30 - 15:30', maMH: 'ENG1001', tenMH: 'Tiếng Anh Chuyên ngành', phong: 'C3-204', gv: 'Cô Phạm Thị D' }
];

const defaultExams = [
    { maMH: 'INT1001', tenMH: 'Cấu trúc dữ liệu & Giải thuật', ngayThi: '2026-06-15', caThi: 'Ca 1 (07:30)', phongThi: 'P.Máy 02', hinhThuc: 'Thực hành' },
    { maMH: 'INT1002', tenMH: 'Lập trình Web Cơ bản', ngayThi: '2026-06-18', caThi: 'Ca 2 (09:30)', phongThi: 'A2-201', hinhThuc: 'Tự luận' }
];

const defaultNotifications = [
    { id: 1, tieuDe: '📢 Lịch đăng ký tín chỉ Học kỳ I (2026 - 2027)', loai: 'Học tập', ngay: '2026-07-20', noiDung: 'Sinh viên các khóa truy cập hệ thống để đăng ký môn học trước ngày 15/08/2026.' },
    { id: 2, tieuDe: '🚨 Cảnh báo học tập đối với sinh viên có GPA dưới 1.0', loai: 'Quan trọng', ngay: '2026-07-15', noiDung: 'Đề nghị các sinh viên thuộc danh sách cảnh báo liên hệ Cố vấn học tập để làm thủ tục.' }
];

let danhSachUsers = JSON.parse(localStorage.getItem('danhSachUsers')) || defaultUsers;
let danhSachKhoa = JSON.parse(localStorage.getItem('danhSachKhoa')) || defaultKhoa;
let danhSachLop = JSON.parse(localStorage.getItem('danhSachLop')) || defaultLop;
let danhSachSinhVien = JSON.parse(localStorage.getItem('danhSachSinhVien')) || defaultStudents;
let danhSachMonHoc = JSON.parse(localStorage.getItem('danhSachMonHoc')) || defaultMonHoc;
let danhSachDiem = JSON.parse(localStorage.getItem('danhSachDiem')) || defaultDiem;
let danhSachDangKy = JSON.parse(localStorage.getItem('danhSachDangKy')) || ['INT1001', 'INT1002'];
let danhSachThongBao = JSON.parse(localStorage.getItem('danhSachThongBao')) || defaultNotifications;

function luuTatCaData() {
    localStorage.setItem('danhSachUsers', JSON.stringify(danhSachUsers));
    localStorage.setItem('danhSachKhoa', JSON.stringify(danhSachKhoa));
    localStorage.setItem('danhSachLop', JSON.stringify(danhSachLop));
    localStorage.setItem('danhSachSinhVien', JSON.stringify(danhSachSinhVien));
    localStorage.setItem('danhSachMonHoc', JSON.stringify(danhSachMonHoc));
    localStorage.setItem('danhSachDiem', JSON.stringify(danhSachDiem));
    localStorage.setItem('danhSachDangKy', JSON.stringify(danhSachDangKy));
    localStorage.setItem('danhSachThongBao', JSON.stringify(danhSachThongBao));
}

// =============================================================
// 2. KHỞI TẠO VÀ ĐIỀU HƯỚNG
// =============================================================
let chartClassInstance = null;
let chartGenderInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    capNhatUIUserInfo();
    apDungPhanQuyenRBAC();
    dongBoDropdownSelects();
    initTabSwitching();
    initFormListeners();
    initModule3Events();

    // Render dữ liệu ban đầu
    locDuLieu();
    renderBangLop();
    renderBangKhoa();
    renderBangUser();
    renderBangMonHoc();
    renderBangDangKyMon();
    renderBangDiem();
    renderScheduleAndExams();
    renderThongBao();
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
    if (role === 'Admin') {
        const btnTaoTB = document.getElementById('btnTaoThongBao');
        if (btnTaoTB) btnTaoTB.style.display = 'inline-flex';
    }
    if (role === 'Sinh viên') {
        if (document.getElementById('btnThemSV')) document.getElementById('btnThemSV').style.display = 'none';
        if (document.getElementById('btnNhapExcel')) document.getElementById('btnNhapExcel').style.display = 'none';
        if (document.getElementById('colCheckAll')) document.getElementById('colCheckAll').style.display = 'none';
        if (document.getElementById('colHanhDong')) document.getElementById('colHanhDong').style.display = 'none';
        document.querySelectorAll('.colHanhDongChung').forEach(el => el.style.display = 'none');
    }
}

function dongModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function initTabSwitching() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
        item.addEventListener('click', function() {
            menuItems.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            const tabTarget = this.getAttribute('data-tab');
            
            const sections = ['dashboard', 'students', 'classes', 'departments', 'users', 'subjects', 'registration', 'grades', 'schedule', 'notifications', 'settings'];
            sections.forEach(s => {
                const el = document.getElementById('section-' + s);
                if (el) el.style.display = (s === tabTarget) ? 'block' : 'none';
            });

            if (tabTarget === 'dashboard') capNhatDashboard();
            if (tabTarget === 'schedule') renderScheduleAndExams();
            if (tabTarget === 'notifications') renderThongBao();
        });
    });
}

// =============================================================
// 3. LOGIC MODULE 3: THỜI KHÓA BIỂU, LỊCH THI, THÔNG BÁO & SETTINGS
// =============================================================
function renderScheduleAndExams() {
    const tbodySchedule = document.getElementById('bang-thoi-khoa-bieu');
    if (tbodySchedule) {
        tbodySchedule.innerHTML = '';
        defaultSchedule.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:bold; color:var(--accent);">${s.thu}</td>
                <td>${s.gio}</td>
                <td style="font-weight:bold;">${s.maMH}</td>
                <td>${s.tenMH}</td>
                <td><span class="badge badge-totnghiep">${s.phong}</span></td>
                <td>${s.gv}</td>
            `;
            tbodySchedule.appendChild(tr);
        });
    }

    const tbodyExams = document.getElementById('bang-lich-thi');
    if (tbodyExams) {
        tbodyExams.innerHTML = '';
        defaultExams.forEach(e => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="font-weight:bold; color:#ef4444;">${e.maMH}</td>
                <td style="font-weight:600;">${e.tenMH}</td>
                <td>${e.ngayThi}</td>
                <td>${e.caThi}</td>
                <td><span class="badge badge-canhbao">${e.phongThi}</span></td>
                <td>${e.hinhThuc}</td>
            `;
            tbodyExams.appendChild(tr);
        });
    }
}

function renderThongBao() {
    const container = document.getElementById('danh-sach-thong-bao');
    if (!container) return;
    container.innerHTML = '';
    
    danhSachThongBao.forEach((tb) => {
        let badgeColor = 'badge-totnghiep';
        if (tb.loai === 'Quan trọng') badgeColor = 'badge-canhbao';
        if (tb.loai === 'Học tập') badgeColor = 'badge-danghoc';

        const div = document.createElement('div');
        div.className = 'notif-item';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span class="badge ${badgeColor}">${tb.loai}</span>
                <span style="font-size:12px; color:var(--text-sub);">🕒 ${tb.ngay}</span>
            </div>
            <h4 style="font-size:16px; margin-bottom:6px; color:var(--text-main);">${tb.tieuDe}</h4>
            <p style="font-size:14px; color:var(--text-sub); line-height:1.5;">${tb.noiDung}</p>
        `;
        container.appendChild(div);
    });
}

function initModule3Events() {
    // Dark Mode / Light Mode Toggle Button
    const btnThemeHeader = document.getElementById('btnThemeToggle');
    const btnThemeSetting = document.getElementById('btnToggleThemeSetting');
    
    function toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        const btnTxt = isLight ? '☀️ Light Mode' : '🌙 Dark Mode';
        if (btnThemeHeader) btnThemeHeader.innerText = btnTxt;
        if (btnThemeSetting) btnThemeSetting.innerText = isLight ? 'Chuyển sang Dark Mode' : 'Chuyển sang Light Mode';
    }

    if (btnThemeHeader) btnThemeHeader.onclick = toggleTheme;
    if (btnThemeSetting) btnThemeSetting.onclick = toggleTheme;

    // Ngôn ngữ (i18n simulation)
    const selectLang = document.getElementById('selectLang');
    if (selectLang) {
        selectLang.onchange = (e) => {
            const lang = e.target.value;
            if (lang === 'en') {
                document.getElementById('txtBrand').innerText = 'EDU MANAGER PRO';
                document.getElementById('txtHeaderTitle').innerText = 'University Training Management System';
                alert('🌐 Switched language to English!');
            } else {
                document.getElementById('txtBrand').innerText = 'EDU MANAGER';
                document.getElementById('txtHeaderTitle').innerText = 'Hệ thống Quản lý Đào tạo Đại học';
                alert('🌐 Đã chuyển sang Tiếng Việt!');
            }
        };
    }

    // Đăng Thông Báo Mới
    const btnTaoTB = document.getElementById('btnTaoThongBao');
    if (btnTaoTB) {
        btnTaoTB.onclick = () => {
            document.getElementById('formThongBao').reset();
            document.getElementById('modalThongBao').style.display = 'flex';
        };
    }

    const formThongBao = document.getElementById('formThongBao');
    if (formThongBao) {
        formThongBao.onsubmit = (e) => {
            e.preventDefault();
            const tieuDe = document.getElementById('inputTieuDeTB').value.trim();
            const loai = document.getElementById('selectLoaiTB').value;
            const noiDung = document.getElementById('inputNoiDungTB').value.trim();
            const ngay = new Date().toISOString().slice(0,10);

            danhSachThongBao.unshift({ id: Date.now(), tieuDe, loai, ngay, noiDung });
            luuTatCaData();
            renderThongBao();
            dongModal('modalThongBao');
            alert('📢 Đã đăng thông báo mới thành công!');
        };
    }
}

// =============================================================
// CÁC HÀM XỬ LÝ KHÁC (GIỮ NGUYÊN TỪ CÁC PHẦN TRƯỚC)
// =============================================================
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

function moModalProfile() {
    const u = danhSachUsers.find(item => item.username === currentUser.username) || currentUser;
    document.getElementById('profUsername').value = u.username;
    document.getElementById('profRole').value = u.role;
    document.getElementById('profHoTen').value = u.hoTen || u.name;
    document.getElementById('profEmail').value = u.email || '';
    document.getElementById('modalProfile').style.display = 'flex';
}

function renderBangUser() {
    const tbody = document.getElementById('bang-tai-khoan');
    if (!tbody) return;
    tbody.innerHTML = '';
    danhSachUsers.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight:bold; color:#60a5fa;">${u.username}</td>
            <td style="font-weight:600;">${u.hoTen}</td>
            <td>${u.email}</td>
            <td><span class="badge badge-totnghiep">${u.role}</span></td>
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaUser(${idx})">✏️ Sửa</button>
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
            <td>${sv.email || '-'}</td>
            <td>${sv.khoa || '-'}</td>
            <td>${sv.lop}</td>
            <td><span class="badge ${badgeClass}">${sv.trangThai}</span></td>
            <td style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaSinhVien(${globalIdx})">✏️</button>
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

function capNhatXoaChon() {
    const checked = document.querySelectorAll('.checkSV:checked');
    const btn = document.getElementById('btnXoaChon');
    const count = document.getElementById('countSelected');
    if (btn && count) {
        count.innerText = checked.length;
        btn.style.display = checked.length > 0 ? 'inline-flex' : 'none';
    }
}

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
            <td>${k.moTa}</td>
            <td class="colHanhDongChung" style="text-align: right;">
                <button style="background:#f59e0b; color:white; border:none; padding:4px 8px; border-radius:4px; font-size:12px; cursor:pointer;" onclick="suaKhoa(${idx})">✏️ Sửa</button>
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

function renderBangDangKyMon() {
    const tbody = document.getElementById('bang-dang-ky-mon');
    if (!tbody) return;
    tbody.innerHTML = '';
    let tongTC = 0;
    danhSachMonHoc.forEach((mh) => {
        const isChecked = danhSachDangKy.includes(mh.maMH);
        if (isChecked) tongTC += Number(mh.tinChi);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:center;"><input type="checkbox" value="${mh.maMH}" ${isChecked ? 'checked' : ''} onchange="tinhTongTinChi()"></td>
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

function renderBangDiem() {
    const tbody = document.getElementById('bang-diem-chi-tiet');
    if (!tbody) return;
    tbody.innerHTML = '';

    let tongDiemNhanTinChi = 0;
    let tongSoTinChi = 0;

    danhSachDiem.forEach((d) => {
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

function capNhatDashboard() {
    const total = danhSachSinhVien.length;
    const active = danhSachSinhVien.filter(s => s.trangThai === 'Đang học').length;
    const warning = danhSachSinhVien.filter(s => s.trangThai === 'Bị cảnh báo').length;
    const graduated = danhSachSinhVien.filter(s => s.trangThai === 'Đã tốt nghiệp').length;

    if (document.getElementById('statTotal')) document.getElementById('statTotal').innerText = total;
    if (document.getElementById('statActive')) document.getElementById('statActive').innerText = active;
    if (document.getElementById('statWarning')) document.getElementById('statWarning').innerText = warning;
    if (document.getElementById('statGraduated')) document.getElementById('statGraduated').innerText = graduated;

    const classCounts = {};
    danhSachSinhVien.forEach(s => classCounts[s.lop] = (classCounts[s.lop] || 0) + 1);

    const ctxClass = document.getElementById('chartClass');
    if (ctxClass) {
        if (chartClassInstance) chartClassInstance.destroy();
        chartClassInstance = new Chart(ctxClass, {
            type: 'bar',
            data: {
                labels: Object.keys(classCounts),
                datasets: [{ label: 'Số lượng sinh viên', data: Object.values(classCounts), backgroundColor: '#4f46e5', borderRadius: 6 }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    const nam = danhSachSinhVien.filter(s => s.gioiTinh === 'Nam').length;
    const nu = danhSachSinhVien.filter(s => s.gioiTinh === 'Nữ').length;
    const ctxGender = document.getElementById('chartGender');
    if (ctxGender) {
        if (chartGenderInstance) chartGenderInstance.destroy();
        chartGenderInstance = new Chart(ctxGender, {
            type: 'doughnut',
            data: { labels: ['Nam', 'Nữ'], datasets: [{ data: [nam, nu], backgroundColor: ['#38bdf8', '#ec4899'] }] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

function initFormListeners() {
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.onclick = () => {
            if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        };
    }

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
            danhSachUsers.push({ username, password, hoTen, email, role });
        } else {
            danhSachUsers[idx] = { username, password, hoTen, email, role };
        }
        luuTatCaData();
        renderBangUser();
        dongModal('modalUser');
    };

    document.getElementById('formProfile').onsubmit = (e) => {
        e.preventDefault();
        const uIdx = danhSachUsers.findIndex(item => item.username === currentUser.username);
        if (uIdx !== -1) {
            danhSachUsers[uIdx].hoTen = document.getElementById('profHoTen').value.trim();
            danhSachUsers[uIdx].email = document.getElementById('profEmail').value.trim();
            currentUser.name = danhSachUsers[uIdx].hoTen;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            luuTatCaData();
            capNhatUIUserInfo();
            dongModal('modalProfile');
            alert('🎉 Cập nhật hồ sơ thành công!');
        }
    };

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

        if (idx === -1) danhSachSinhVien.push({ maSV, hoTen, gioiTinh, ngaySinh, email, trangThai, khoa, lop });
        else danhSachSinhVien[idx] = { maSV, hoTen, gioiTinh, ngaySinh, email, trangThai, khoa, lop };

        luuTatCaData();
        locDuLieu();
        capNhatDashboard();
        dongModal('modalSinhVien');
    };

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

        if (idx === -1) danhSachKhoa.push({ maKhoa, tenKhoa, moTa });
        else danhSachKhoa[idx] = { maKhoa, tenKhoa, moTa };

        luuTatCaData();
        dongBoDropdownSelects();
        renderBangKhoa();
        dongModal('modalKhoa');
    };

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

        if (idx === -1) danhSachLop.push({ maLop, tenLop, khoa });
        else danhSachLop[idx] = { maLop, tenLop, khoa };

        luuTatCaData();
        dongBoDropdownSelects();
        renderBangLop();
        dongModal('modalLop');
    };

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

        if (idx === -1) danhSachMonHoc.push({ maMH, tenMH, tinChi, loaiMon });
        else danhSachMonHoc[idx] = { maMH, tenMH, tinChi, loaiMon };

        luuTatCaData();
        renderBangMonHoc();
        dongBoDropdownSelects();
        dongModal('modalMonHoc');
    };

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
        if (existingIdx !== -1) danhSachDiem[existingIdx] = { maSV, maMH, diemQT, diemThi };
        else danhSachDiem.push({ maSV, maMH, diemQT, diemThi });

        luuTatCaData();
        renderBangDiem();
        dongModal('modalNhapDiem');
    };

    document.getElementById('btnLuuDangKy').onclick = () => {
        const checkboxes = document.querySelectorAll('#bang-dang-ky-mon input[type="checkbox"]:checked');
        danhSachDangKy = Array.from(checkboxes).map(cb => cb.value);
        luuTatCaData();
        alert('🎉 Đã lưu danh sách môn học đăng ký!');
    };

    document.getElementById('timKiemInput')?.addEventListener('input', locDuLieu);
    document.getElementById('filterKhoa')?.addEventListener('change', locDuLieu);
    document.getElementById('filterLop')?.addEventListener('change', locDuLieu);

    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.onclick = function() {
            document.querySelectorAll('.checkSV').forEach(cb => cb.checked = this.checked);
            capNhatXoaChon();
        };
    }

    document.getElementById('btnInBangDiem').onclick = () => window.print();
}

function initExcelEvents() {
    const btnXuat = document.getElementById('btnXuatExcel');
    if (btnXuat) {
        btnXuat.onclick = () => {
            const worksheet = XLSX.utils.json_to_sheet(danhSachSinhVien);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "SinhVien");
            XLSX.writeFile(workbook, "DanhSachSinhVien.xlsx");
        };
    }
}