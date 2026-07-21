const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// 1. Vá lỗi lệch tên biến trong hàm toggleAuthMode để cứu sống JavaScript
if (html.includes('function toggleAuthMode() {')) {
    html = html.replace(
        'function toggleAuthMode() {',
        `function toggleAuthMode() {
            const txtTitle = document.getElementById('txtAuthTitle') || { innerText: '' };
            const btnSubmit = document.getElementById('btnAuthSubmit') || { innerText: '', style: {} };
            const btnToggle = document.getElementById('btnToggleAuthMode') || { innerText: '' };`
    );
} else if (html.includes('function toggleAuthMode(')) {
    // Trường hợp viết không có dấu cách
    html = html.replace(
        'function toggleAuthMode(',
        `function toggleAuthMode(\n            const txtTitle = document.getElementById('txtAuthTitle') || { innerText: '' };\n            const btnSubmit = document.getElementById('btnAuthSubmit') || { innerText: '', style: {} };\n            const btnToggle = document.getElementById('btnToggleAuthMode') || { innerText: '' };\n`
    );
}

// 2. Bơm hàm togglePasswordVisibility chuẩn chỉnh vào hệ thống
if (!html.includes('function togglePasswordVisibility')) {
    const eyeFunc = `
    function togglePasswordVisibility() {
        const pwd = document.getElementById('inputPassword');
        if (pwd) {
            pwd.type = pwd.type === 'password' ? 'text' : 'password';
        }
    }
    `;
    html = html.replace('async function xuLyAuth', eyeFunc + '\n    async function xuLyAuth');
}

fs.writeFileSync('./public/index.html', html);
console.log('🎉 [Frontend] Đã vá lỗi crash JavaScript và kích hoạt lại nút con mắt thành công!');
