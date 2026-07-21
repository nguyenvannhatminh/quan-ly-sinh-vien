const fs = require('fs');

// 1. Sửa lỗi nút con mắt
let html = fs.readFileSync('./public/index.html', 'utf8');
if (!html.includes('function togglePasswordVisibility')) {
    const toggleScript = `
        function togglePasswordVisibility() {
            const pwd = document.getElementById('inputPassword');
            if (pwd.type === 'password') {
                pwd.type = 'text';
            } else {
                pwd.type = 'password';
            }
        }
`;
    // Chèn hàm này vào ngay trước hàm xuLyAuth
    html = html.replace('async function xuLyAuth', toggleScript + '\n        async function xuLyAuth');
    fs.writeFileSync('./public/index.html', html);
    console.log('✅ Đã sửa xong lỗi con mắt! Bro ra F5 web là xem được mật khẩu nhé.');
} else {
    console.log('✅ Chức năng xem mật khẩu đã được cài đặt từ trước.');
}

// 2. Chụp X-quang phần Backend Đăng ký
console.log('\n🔍 === CHỤP X-QUANG AUTH CONTROLLER ===');
try {
    console.log(fs.readFileSync('./src/auth/auth.controller.ts', 'utf8'));
} catch (e) {
    console.log('❌ Không tìm thấy file src/auth/auth.controller.ts');
}
