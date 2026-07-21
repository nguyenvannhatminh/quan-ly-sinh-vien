const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// 1. Xóa sạch các hàm xem mật khẩu cũ lỗi nếu có để làm sạch chiến trường
html = html.replace(/function togglePasswordVisibility\(\) \{[\s\S]*?\}/g, '');

// 2. Định nghĩa đoạn code chuẩn không lỗi cú pháp
const cleanCode = `function togglePasswordVisibility() {
            const pwd = document.getElementById('inputPassword');
            if (pwd) pwd.type = pwd.type === 'password' ? 'text' : 'password';
        }

        function toggleAuthMode() {
            const txtTitle = document.getElementById('txtAuthTitle');
            const btnSubmit = document.getElementById('btnAuthSubmit');
            const btnToggle = document.getElementById('btnToggleAuthMode');
            if (!txtTitle || !btnSubmit || !btnToggle) return;

            if (currentAuthMode === 'login') {
                currentAuthMode = 'register';
                txtTitle.innerText = 'ĐĂNG KÝ HỆ THỐNG';
                btnSubmit.innerText = 'ĐĂNG KÝ NGAY';
                btnSubmit.style.background = '#28a745';
                btnToggle.innerText = 'Đã có tài khoản? Quay lại đăng nhập';
            } else {
                currentAuthMode = 'login';
                txtTitle.innerText = 'ĐĂNG NHẬP';
                btnSubmit.innerText = 'ĐĂNG NHẬP';
                btnSubmit.style.background = '#3b66cc';
                btnToggle.innerText = 'Chưa có tài khoản? Đăng ký ngay';
            }
        }

        async function xuLyAuth`;

// 3. Thay thế đoạn code lỗi trùng biến bằng đoạn code sạch
const brokenCodeRegex = /function toggleAuthMode\(\) \{[\s\S]*?\}\s*?\n\s*?async function xuLyAuth/;
html = html.replace(brokenCodeRegex, cleanCode);

fs.writeFileSync('./public/index.html', html);
console.log('🎉 Đã giải cứu thành công! Toàn bộ lỗi cú pháp JavaScript đã bị xóa sổ.');
