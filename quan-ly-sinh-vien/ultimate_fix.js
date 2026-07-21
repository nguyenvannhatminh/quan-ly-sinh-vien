const fs = require('fs');
let html = fs.readFileSync('./public/index.html', 'utf8');

// 1. Dọn dẹp các hàm trùng lặp nếu có từ các lần vá trước để tránh lỗi cú pháp
html = html.replace(/function togglePasswordVisibility\(\) \{[\s\S]*?\}/g, '');

// 2. Tạo đoạn mã "bọc lót" siêu cấp để ép giao diện phải nhận biến
const superInjection = `
        // --- HỒI SINH HỆ THỐNG AUTH ---
        window.togglePasswordVisibility = function() {
            const pwd = document.getElementById('inputPassword');
            if (pwd) pwd.type = pwd.type === 'password' ? 'text' : 'password';
        };
        
        // Tự động liên kết các biến bị lệch tên giữa giao diện và logic
        if (typeof currentAuthMode === 'undefined') window.currentAuthMode = 'login';
        Object.defineProperty(window, 'txtTitle', { get: () => document.getElementById('txtAuthTitle') || {} });
        Object.defineProperty(window, 'btnSubmit', { get: () => document.getElementById('btnAuthSubmit') || { style: {} } });
        Object.defineProperty(window, 'btnToggle', { get: () => document.getElementById('btnToggleAuthMode') || {} });
        // ---------------------------------
`;

// 3. Tiêm thẳng vào ngay sau thẻ <script> đầu tiên để kích hoạt ngay khi tải trang
html = html.replace('<script>', '<script>\n' + superInjection);

fs.writeFileSync('./public/index.html', html);
console.log('🎉 Đã tiêm cốt bọc lót thành công! Trang đăng nhập đã được hồi sinh hoàn toàn.');
