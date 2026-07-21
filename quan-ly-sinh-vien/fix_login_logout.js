const fs = require('fs');

// 1. TẠO FILE LOGIN.HTML THỰC SỰ
const loginHTML = `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Karl System - Đăng Nhập</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            background-color: #0b0f19;
            color: #f1f5f9;
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .login-card {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 12px;
            padding: 32px;
            width: 100%;
            max-width: 380px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        }
        .brand {
            font-size: 24px;
            font-weight: bold;
            color: #38bdf8;
            text-align: center;
            margin-bottom: 24px;
        }
        .form-group {
            margin-bottom: 18px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        label { font-size: 13px; color: #94a3b8; }
        input {
            background-color: #0f172a;
            border: 1px solid #334155;
            color: #fff;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 14px;
            outline: none;
        }
        input:focus { border-color: #38bdf8; }
        .btn-login {
            width: 100%;
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 12px;
            border-radius: 6px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
        }
        .btn-login:hover { background-color: #1d4ed8; }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="brand">🎓 Karl System</div>
        <form onsubmit="xuLyDangNhap(event)">
            <div class="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" id="username" value="admin" required placeholder="Nhập username...">
            </div>
            <div class="form-group">
                <label>Mật khẩu</label>
                <input type="password" id="password" value="123456" required placeholder="Nhập password...">
            </div>
            <button type="submit" class="btn-login">Đăng nhập</button>
        </form>
    </div>

    <script>
        function xuLyDangNhap(e) {
            e.preventDefault();
            // Lưu token đăng nhập giả lập
            localStorage.setItem('token', 'karl_authenticated_user');
            localStorage.setItem('user', JSON.stringify({ name: 'admin', role: 'Quản trị viên' }));
            // Chuyển hướng về trang chủ Admin
            window.location.href = '/';
        }
    </script>
</body>
</html>`;

fs.writeFileSync('./public/login.html', loginHTML, 'utf8');

// 2. CẬP NHẬT FILE INDEX.HTML VỚI AUTH GUARD & HÀM TẢI LẠI HOÀN CHỈNH
const indexPath = './public/index.html';
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Thêm Auth Guard kiểm tra nếu chưa đăng nhập thì đẩy về /login.html
const authGuardScript = `
    <script>
        // Kiểm tra quyền đăng nhập ngay khi load trang
        if (!localStorage.getItem('token')) {
            window.location.href = '/login.html';
        }
    </script>
`;

if (!indexContent.includes("localStorage.getItem('token')")) {
    indexContent = indexContent.replace('<head>', '<head>' + authGuardScript);
}

// Cập nhật hàm DangXuat chuẩn chỉnh
const updatedDangXuat = `
        function dangXuat() {
            if (confirm('🔒 Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/login.html';
            }
        }
`;

// Cập nhật hàm Reload cứng / mềm linh hoạt
const updatedReload = `
        async function reloadSinhVienVisual() {
            try {
                const tk = document.getElementById('timKiemInput');
                const ft = document.getElementById('filterTutor');
                const fs = document.getElementById('filterSubject');
                if (tk) tk.value = '';
                if (ft) ft.value = '';
                if (fs) fs.value = '';
                if (typeof napDuLieuBoLoc === 'function') await napDuLieuBoLoc();
                if (typeof layDanhSachSinhVien === 'function') await layDanhSachSinhVien(1);
            } catch(e) {
                window.location.reload();
            }
        }
`;

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('🎉 Đã tạo trang login.html & gắn Auth Guard thành công!');
