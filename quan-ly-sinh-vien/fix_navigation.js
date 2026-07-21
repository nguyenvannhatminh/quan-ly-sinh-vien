const fs = require('fs');
const filePath = './public/index.html';

const multiTabHTML = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karl System - Hệ Thống Quản Lý</title>
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #0b0f19;
            color: #f1f5f9;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            min-height: 100vh;
        }

        /* Sidebar */
        .sidebar {
            width: 240px;
            background-color: #0f172a;
            border-right: 1px solid #1e293b;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0;
            flex-shrink: 0;
        }
        .sidebar-brand {
            font-size: 20px;
            font-weight: bold;
            color: #f8fafc;
            padding: 0 20px 20px 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .sidebar-menu { list-style: none; }
        .sidebar-menu li a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: #94a3b8;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
        }
        .sidebar-menu li a:hover, .sidebar-menu li.active a {
            background-color: #1e293b;
            color: #38bdf8;
            border-left: 3px solid #38bdf8;
        }
        .sidebar-bottom { padding: 0 20px; }
        .sidebar-bottom a {
            color: #ef4444;
            text-decoration: none;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
        }

        /* Main Wrapper */
        .main-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
        .topbar {
            height: 60px;
            background-color: #0f172a;
            border-bottom: 1px solid #1e293b;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            padding: 0 24px;
            gap: 16px;
        }
        .user-profile {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
        }
        .avatar {
            width: 32px;
            height: 32px;
            background-color: #2563eb;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        /* Content Area */
        .content-container {
            padding: 24px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
        }

        /* Tab Switcher CSS */
        .tab-view { display: none; }
        .tab-view.active { display: block; }

        /* Header Bar & Actions */
        .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 12px;
        }
        .header-title {
            font-size: 22px;
            font-weight: 700;
            color: #f8fafc;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .action-buttons {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .btn {
            padding: 8px 14px;
            border-radius: 6px;
            border: none;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .btn-blue { background-color: #2563eb; }
        .btn-teal { background-color: #0d9488; }
        .btn-orange { background-color: #d97706; }
        .btn-green { background-color: #059669; }
        .btn-red { background-color: #ef4444; }

        /* Filter Box */
        .filter-row {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }
        .filter-row input, .filter-row select {
            background-color: #1e293b;
            border: 1px solid #334155;
            color: #f8fafc;
            padding: 9px 12px;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
        }
        .filter-row input { flex: 1; min-width: 220px; }
        .filter-row select { width: 180px; }

        /* Form Add Card */
        .card {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }
        .card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #38bdf8;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; color: #94a3b8; }
        .form-group input, .form-group select {
            background-color: #0f172a;
            border: 1px solid #334155;
            color: #f8fafc;
            padding: 9px 12px;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
        }
        .checkbox-group {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }
        .checkbox-item {
            background-color: #0f172a;
            padding: 6px 12px;
            border-radius: 6px;
            border: 1px solid #334155;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }

        /* Table */
        .table-container {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
        }
        th {
            background-color: #0f172a;
            color: #94a3b8;
            padding: 12px 16px;
            font-size: 12px;
            text-transform: uppercase;
            border-bottom: 1px solid #334155;
        }
        td {
            padding: 14px 16px;
            border-bottom: 1px solid #334155;
            font-size: 14px;
            color: #e2e8f0;
        }
        tr:last-child td { border-bottom: none; }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 6px;
            margin-top: 20px;
        }
        .page-btn {
            background-color: #1e293b;
            border: 1px solid #334155;
            color: #94a3b8;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 13px;
        }
        .page-btn.active {
            background-color: #2563eb;
            color: #fff;
            border-color: #2563eb;
        }
    </style>
</head>
<body>

    <!-- Sidebar Menu điều hướng -->
    <div class="sidebar">
        <div>
            <div class="sidebar-brand">🎓 Karl System</div>
            <ul class="sidebar-menu">
                <li id="menu-tongquan"><a onclick="switchTab('tongquan')">📊 Tổng quan</a></li>
                <li id="menu-sinhvien" class="active"><a onclick="switchTab('sinhvien')">🎓 Quản lý Sinh viên</a></li>
                <li id="menu-giangvien"><a onclick="switchTab('giangvien')">👨‍🏫 Danh sách Giảng viên</a></li>
                <li id="menu-monhoc"><a onclick="switchTab('monhoc')">📚 Danh mục Môn học</a></li>
            </ul>
        </div>
        <div class="sidebar-bottom">
            <a href="#">🚪 Đăng xuất</a>
        </div>
    </div>

    <!-- Main Wrapper -->
    <div class="main-wrapper">
        <div class="topbar">
            <div class="user-profile">
                <div>
                    <div style="font-weight: bold; text-align: right;">admin</div>
                    <div style="color: #94a3b8; font-size: 11px;">Quản trị viên</div>
                </div>
                <div class="avatar">A</div>
            </div>
        </div>

        <div class="content-container">

            <!-- ================= TAB TỔNG QUAN ================= -->
            <div id="view-tongquan" class="tab-view">
                <div class="header-bar">
                    <h2 class="header-title">📊 Tổng Quan Hệ Thống</h2>
                </div>
                <div class="card">
                    <h3 style="color:#38bdf8; margin-bottom:10px;">Thống kê hệ thống</h3>
                    <p style="color:#cbd5e1;">Chào mừng bạn quay trở lại với Karl System. Hãy chọn menu bên trái để quản lý Sinh viên, Giảng viên hoặc Môn học.</p>
                </div>
            </div>

            <!-- ================= TAB SINH VIÊN ================= -->
            <div id="view-sinhvien" class="tab-view active">
                <div class="header-bar">
                    <h2 class="header-title">🎓 Quản lý Hồ sơ Sinh viên</h2>
                    <div class="action-buttons">
                        <button class="btn btn-red" id="btnXoaHangLoat" style="display:none;" onclick="xoaHangLoatSinhVien()">🗑️ Xóa đã chọn</button>
                        <button class="btn btn-blue" onclick="reloadSinhVienVisual()">🔄 Tải lại</button>
                        <button class="btn btn-teal" onclick="taiFileExcelMau()">📄 Tải Mẫu Excel</button>
                        <button class="btn btn-orange" onclick="document.getElementById('excelFileInput').click()">📥 Nhập Excel</button>
                        <button class="btn btn-green" onclick="xuatExcelSinhVien()">📤 Xuất Excel</button>
                    </div>
                </div>

                <div class="filter-row">
                    <input type="text" id="timKiemInput" placeholder="🔍 Tìm kiếm tên, email, mã sinh viên..." oninput="layDanhSachSinhVien(1)">
                    <select id="filterTutor" onchange="layDanhSachSinhVien(1)">
                        <option value="">-- Tất cả CVHT --</option>
                    </select>
                    <select id="filterSubject" onchange="layDanhSachSinhVien(1)">
                        <option value="">-- Tất cả Môn học --</option>
                    </select>
                </div>

                <div class="card">
                    <div class="card-title">➕ Thêm Sinh viên mới</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Họ và Tên (*)</label>
                            <input type="text" id="tenSV" placeholder="Nhập tên sinh viên...">
                        </div>
                        <div class="form-group">
                            <label>Email cá nhân</label>
                            <input type="email" id="emailSV" placeholder="Nhập email sinh viên...">
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label>Giảng viên Cố vấn (CVHT)</label>
                        <select id="tutorSelect">
                            <option value="">-- Không có --</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Môn học đang đăng ký</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item"><input type="checkbox" name="monhoc" value="toán cao cấp"> toán cao cấp</label>
                            <label class="checkbox-item"><input type="checkbox" name="monhoc" value="triết học"> triết học</label>
                            <label class="checkbox-item"><input type="checkbox" name="monhoc" value="Lịch sử"> Lịch sử</label>
                            <label class="checkbox-item"><input type="checkbox" name="monhoc" value="đi ngủ"> đi ngủ</label>
                        </div>
                    </div>
                    <button class="btn btn-green" style="padding: 10px 20px; margin-top: 8px;" onclick="themSinhVien()">Lưu Hồ sơ</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 40px; text-align: center;"><input type="checkbox" id="selectAll"></th>
                                <th>MÃ SV</th>
                                <th>HỌ TÊN</th>
                                <th>EMAIL</th>
                                <th>CỐ VẤN HỌC TẬP</th>
                                <th>MÔN HỌC</th>
                                <th style="text-align: right;">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-sinhvien">
                            <tr><td colspan="7" style="text-align: center; padding: 20px; color: #60a5fa;">⏳ Đang tải danh sách sinh viên...</td></tr>
                        </tbody>
                    </table>
                </div>

                <div class="pagination">
                    <button class="page-btn">⏮️ Trước</button>
                    <button class="page-btn active">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">Sau ⏭️</button>
                </div>
            </div>

            <!-- ================= TAB GIẢNG VIÊN ================= -->
            <div id="view-giangvien" class="tab-view">
                <div class="header-bar">
                    <h2 class="header-title">👨‍🏫 Quản lý Danh sách Giảng viên</h2>
                    <div class="action-buttons">
                        <button class="btn btn-blue" onclick="layDanhSachGiangVien()">🔄 Tải lại</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">➕ Thêm Giảng viên</div>
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Họ và Tên Giảng viên (*)</label>
                            <input type="text" id="tenGV" placeholder="Nhập tên giảng viên...">
                        </div>
                        <div class="form-group">
                            <label>Email liên hệ</label>
                            <input type="email" id="emailGV" placeholder="Nhập email giảng viên...">
                        </div>
                    </div>
                    <button class="btn btn-green" onclick="themGiangVien()">Thêm ngay</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>MÃ GV</th>
                                <th>TÊN GIẢNG VIÊN</th>
                                <th>EMAIL</th>
                                <th style="text-align: right;">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-giangvien">
                            <tr><td colspan="4" style="text-align: center; padding: 20px; color: #60a5fa;">⏳ Đang tải danh sách giảng viên...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- ================= TAB MÔN HỌC ================= -->
            <div id="view-monhoc" class="tab-view">
                <div class="header-bar">
                    <h2 class="header-title">📚 Quản lý Danh mục Môn học</h2>
                    <div class="action-buttons">
                        <button class="btn btn-blue" onclick="layDanhSachMonHoc()">🔄 Tải lại</button>
                    </div>
                </div>

                <div class="card">
                    <div class="card-title">➕ Thêm Môn học mới</div>
                    <div class="form-group" style="margin-bottom: 16px;">
                        <label>Tên Môn học (*)</label>
                        <input type="text" id="tenMonHoc" placeholder="Nhập tên môn học...">
                    </div>
                    <button class="btn btn-green" onclick="themMonHoc()">Thêm Môn học</button>
                </div>

                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>MÃ MÔN</th>
                                <th>TÊN MÔN HỌC</th>
                                <th style="text-align: right;">HÀNH ĐỘNG</th>
                            </tr>
                        </thead>
                        <tbody id="tbody-monhoc">
                            <tr><td colspan="3" style="text-align: center; padding: 20px; color: #60a5fa;">⏳ Đang tải danh sách môn học...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <input type="file" id="excelFileInput" accept=".xlsx, .xls" style="display: none;" onchange="xuLyImportExcel(event)">

    <script>
        let currentPage = 1;

        // BỘ ĐIỀU HƯỚNG CHUYỂN TAB
        function switchTab(tabName) {
            document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.sidebar-menu li').forEach(el => el.classList.remove('active'));

            const targetView = document.getElementById('view-' + tabName);
            const targetMenu = document.getElementById('menu-' + tabName);

            if (targetView) targetView.classList.add('active');
            if (targetMenu) targetMenu.classList.add('active');

            if (tabName === 'sinhvien') layDanhSachSinhVien(1);
            else if (tabName === 'giangvien') layDanhSachGiangVien();
            else if (tabName === 'monhoc') layDanhSachMonHoc();
        }

        // ================= GIẢNG VIÊN APIs =================
        async function layDanhSachGiangVien() {
            const tbody = document.getElementById('tbody-giangvien');
            try {
                const res = await fetch('/tutor');
                if (!res.ok) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi lấy dữ liệu Giảng viên!</td></tr>';
                    return;
                }
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.data || []);

                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#94a3b8;">📂 Chưa có giảng viên nào.</td></tr>';
                    return;
                }

                tbody.innerHTML = list.map(gv => {
                    const id = gv.TID || gv.id || '--';
                    const name = gv.name || 'Chưa đặt tên';
                    const email = gv.email || '--';
                    return \`
                        <tr>
                            <td style="font-weight: 600; color: #60a5fa;">\${id}</td>
                            <td style="font-weight: bold; color: #f8fafc;">\${name}</td>
                            <td style="color: #cbd5e1;">\${email}</td>
                            <td style="text-align: right;">
                                <button class="btn btn-orange" style="display:inline-block; padding:4px 10px; font-size:12px;">✏️ Sửa</button>
                                <button class="btn btn-red" style="display:inline-block; padding:4px 10px; font-size:12px;" onclick="xoaGiangVien(\${id}, '\${name}')">🗑️</button>
                            </td>
                        </tr>\`;
                }).join('');
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi kết nối API Giảng viên!</td></tr>';
            }
        }

        async function themGiangVien() {
            const name = document.getElementById('tenGV').value.trim();
            const email = document.getElementById('emailGV').value.trim();
            if (!name) { alert('⚠️ Vui lòng nhập tên Giảng viên!'); return; }

            try {
                const res = await fetch('/tutor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email })
                });
                if (res.ok) {
                    alert('🎉 Thêm giảng viên thành công!');
                    document.getElementById('tenGV').value = '';
                    document.getElementById('emailGV').value = '';
                    layDanhSachGiangVien();
                    napDuLieuBoLoc();
                } else { alert('❌ Thêm thất bại!'); }
            } catch(e) { alert('❌ Lỗi kết nối!'); }
        }

        async function xoaGiangVien(id, name) {
            if (!confirm(\`⚠️ Bạn có chắc muốn xóa giảng viên "\${name}"?\`)) return;
            try {
                const res = await fetch('/tutor/' + id, { method: 'DELETE' });
                if (res.ok) {
                    alert('🎉 Xóa giảng viên thành công!');
                    layDanhSachGiangVien();
                    napDuLieuBoLoc();
                } else { alert('❌ Xóa thất bại!'); }
            } catch(e) { alert('❌ Lỗi hệ thống!'); }
        }

        // ================= MÔN HỌC APIs =================
        async function layDanhSachMonHoc() {
            const tbody = document.getElementById('tbody-monhoc');
            try {
                const res = await fetch('/subject');
                if (!res.ok) {
                    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi lấy danh sách môn học!</td></tr>';
                    return;
                }
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.data || []);

                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#94a3b8;">📂 Chưa có môn học nào.</td></tr>';
                    return;
                }

                tbody.innerHTML = list.map(mh => {
                    const id = mh.SubID || mh.id || '--';
                    const name = mh.name || 'Chưa đặt tên';
                    return \`
                        <tr>
                            <td style="font-weight: 600; color: #60a5fa;">\${id}</td>
                            <td style="font-weight: bold; color: #f8fafc;">\${name}</td>
                            <td style="text-align: right;">
                                <button class="btn btn-orange" style="display:inline-block; padding:4px 10px; font-size:12px;">✏️ Sửa</button>
                                <button class="btn btn-red" style="display:inline-block; padding:4px 10px; font-size:12px;" onclick="xoaMonHoc(\${id}, '\${name}')">🗑️</button>
                            </td>
                        </tr>\`;
                }).join('');
            } catch(e) {
                tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi kết nối API Môn học!</td></tr>';
            }
        }

        async function themMonHoc() {
            const name = document.getElementById('tenMonHoc').value.trim();
            if (!name) { alert('⚠️ Vui lòng nhập tên môn học!'); return; }

            try {
                const res = await fetch('/subject', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                });
                if (res.ok) {
                    alert('🎉 Thêm môn học thành công!');
                    document.getElementById('tenMonHoc').value = '';
                    layDanhSachMonHoc();
                    napDuLieuBoLoc();
                } else { alert('❌ Thêm thất bại!'); }
            } catch(e) { alert('❌ Lỗi kết nối!'); }
        }

        async function xoaMonHoc(id, name) {
            if (!confirm(\`⚠️ Bạn có chắc muốn xóa môn học "\${name}"?\`)) return;
            try {
                const res = await fetch('/subject/' + id, { method: 'DELETE' });
                if (res.ok) {
                    alert('🎉 Xóa môn học thành công!');
                    layDanhSachMonHoc();
                    napDuLieuBoLoc();
                } else { alert('❌ Xóa thất bại!'); }
            } catch(e) { alert('❌ Lỗi hệ thống!'); }
        }

        // ================= SINH VIÊN APIs =================
        async function layDanhSachSinhVien(page = 1) {
            currentPage = page;
            const searchVal = document.getElementById('timKiemInput')?.value || '';
            const tutorVal = document.getElementById('filterTutor')?.value || '';
            const subjectVal = document.getElementById('filterSubject')?.value || '';

            let url = \`/sinh-vien?page=\${page}&limit=10&search=\${encodeURIComponent(searchVal)}\`;
            if (tutorVal) url += \`&tutorId=\${encodeURIComponent(tutorVal)}\`;
            if (subjectVal) url += \`&subjectId=\${encodeURIComponent(subjectVal)}\`;

            const tbody = document.getElementById('tbody-sinhvien');

            try {
                const res = await fetch(url);
                if (!res.ok) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi máy chủ!</td></tr>';
                    return;
                }

                const rawData = await res.json();
                const list = Array.isArray(rawData) ? rawData : (rawData.data || []);

                if (list.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:25px; color:#94a3b8;">📂 Chưa có sinh viên nào.</td></tr>';
                    return;
                }

                tbody.innerHTML = list.map(sv => {
                    const id = sv.SID || sv.id || '--';
                    const name = sv.name || sv.hoTen || 'Chưa đặt tên';
                    const email = sv.email || '--';
                    
                    let tutorName = 'Chưa ĐK';
                    if (sv.tutor) {
                        tutorName = typeof sv.tutor === 'object' ? (sv.tutor.name || 'Chưa ĐK') : sv.tutor;
                    }

                    let subjectsBadge = '<span style="color:#94a3b8;">Trống</span>';
                    if (Array.isArray(sv.subjects) && sv.subjects.length > 0) {
                        subjectsBadge = sv.subjects.map(s => {
                            const sName = typeof s === 'object' ? s.name : s;
                            return \`<span style="background:#334155; color:#f8fafc; padding:3px 8px; border-radius:4px; font-size:12px; margin-right:4px;">\${sName}</span>\`;
                        }).join('');
                    }

                    return \`
                        <tr>
                            <td style="text-align: center;"><input type="checkbox" class="sv-checkbox" value="\${id}" onchange="capNhatNutXoaHangLoat()"></td>
                            <td style="font-weight: 600; color: #60a5fa;">\${id}</td>
                            <td style="font-weight: bold; color: #f8fafc;">\${name}</td>
                            <td style="color: #cbd5e1;">\${email}</td>
                            <td style="color: #94a3b8;">\${tutorName}</td>
                            <td>\${subjectsBadge}</td>
                            <td style="text-align: right;">
                                <button class="btn btn-orange" style="display:inline-block; padding:4px 10px; font-size:12px;" onclick="kichHoatCheDoSua(\${id})">✏️ Sửa</button>
                                <button class="btn btn-blue" style="display:inline-block; padding:4px 10px; font-size:12px;" onclick="openGradeModal(\${id})">📝 Nhập điểm</button>
                                <button class="btn btn-red" style="display:inline-block; padding:4px 10px; font-size:12px;" onclick="xoaSinhVien(\${id}, '\${name}')">🗑️</button>
                            </td>
                        </tr>\`;
                }).join('');

            } catch(err) {
                console.error(err);
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">❌ Lỗi kết nối API!</td></tr>';
            }
        }

        async function themSinhVien() {
            const name = document.getElementById('tenSV').value.trim();
            const email = document.getElementById('emailSV').value.trim();
            if (!name) { alert('⚠️ Vui lòng nhập Họ tên sinh viên!'); return; }

            try {
                const res = await fetch('/sinh-vien', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email })
                });
                if (res.ok) {
                    alert('🎉 Thêm sinh viên thành công!');
                    document.getElementById('tenSV').value = '';
                    document.getElementById('emailSV').value = '';
                    layDanhSachSinhVien(1);
                } else {
                    alert('❌ Thêm thất bại!');
                }
            } catch(e) { alert('❌ Lỗi kết nối!'); }
        }

        async function xoaSinhVien(id, name) {
            if (!confirm(\`⚠️ Bạn có chắc muốn xóa sinh viên "\${name}" (Mã: \${id}) không?\`)) return;
            try {
                const res = await fetch('/sinh-vien/' + id, { method: 'DELETE' });
                if (res.ok) {
                    alert('🎉 Đã xóa thành công!');
                    layDanhSachSinhVien(currentPage);
                } else { alert('❌ Xóa thất bại!'); }
            } catch(e) { alert('❌ Lỗi kết nối server!'); }
        }

        function capNhatNutXoaHangLoat() {
            const selected = document.querySelectorAll('.sv-checkbox:checked');
            const btnXoa = document.getElementById('btnXoaHangLoat');
            if (btnXoa) {
                btnXoa.style.display = selected.length > 0 ? 'inline-block' : 'none';
                btnXoa.innerHTML = \`🗑️ Xóa đã chọn (\${selected.length})\`;
            }
        }

        function reloadSinhVienVisual() {
            document.getElementById('timKiemInput').value = '';
            document.getElementById('filterTutor').value = '';
            document.getElementById('filterSubject').value = '';
            layDanhSachSinhVien(1);
        }

        function xuatExcelSinhVien() {
            const table = document.querySelector('#view-sinhvien table');
            if (!table) return;
            const cloneTable = table.cloneNode(true);
            const excelHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>' + cloneTable.outerHTML + '</body></html>';
            const blob = new Blob(['\\ufeff' + excelHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Danh_Sach_Sinh_Vien.xls';
            a.click();
        }

        function taiFileExcelMau() {
            if (typeof XLSX === 'undefined') { alert('Thư viện Excel đang tải, thử lại sau 2 giây!'); return; }
            const ws = XLSX.utils.json_to_sheet([{ "Họ và Tên": "Nguyễn Văn A", "Email": "a@gmail.com" }]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Mau_Sinh_Vien");
            XLSX.writeFile(wb, "Mau_Nhap_Sinh_Vien.xlsx");
        }

        async function napDuLieuBoLoc() {
            try {
                const [tutorRes, subjectRes] = await Promise.all([fetch('/tutor'), fetch('/subject')]);
                if (tutorRes.ok) {
                    const list = await tutorRes.json();
                    const sel = document.getElementById('filterTutor');
                    const tutorSel = document.getElementById('tutorSelect');
                    const data = Array.isArray(list) ? list : (list.data || []);
                    const opts = data.map(t => \`<option value="\${t.TID || t.id}">\${t.name}</option>\`).join('');
                    if (sel) sel.innerHTML = '<option value="">-- Tất cả CVHT --</option>' + opts;
                    if (tutorSel) tutorSel.innerHTML = '<option value="">-- Không có --</option>' + opts;
                }
                if (subjectRes.ok) {
                    const list = await subjectRes.json();
                    const sel = document.getElementById('filterSubject');
                    const data = Array.isArray(list) ? list : (list.data || []);
                    if (sel) sel.innerHTML = '<option value="">-- Tất cả Môn học --</option>' + data.map(s => \`<option value="\${s.SubID || s.id}">\${s.name}</option>\`).join('');
                }
            } catch(e) {}
        }

        document.addEventListener('DOMContentLoaded', () => {
            napDuLieuBoLoc();
            layDanhSachSinhVien(1);
        });
    </script>
</body>
</html>`;

fs.writeFileSync(filePath, multiTabHTML, 'utf8');
console.log('🎉 Đã kích hoạt Router chuyển Tab cho Giảng viên & Môn học thành công!');
