const fs = require('fs');
const html = fs.readFileSync('./public/index.html', 'utf8');

// Định vị đoạn code bắt đầu từ hàm xoaSubject
const startIndex = html.indexOf('async function xoaSubject(id, name)');
const endIndex = html.indexOf('</script>', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    // Khối code chuẩn chỉnh của hàm xoaSubject
    const cleanXoaSubject = `async function xoaSubject(id, name) { 
            if(!confirm('Xóa môn học ' + name + '?')) return; 
            if(await fetch('/subject/' + id, { method: 'DELETE' }).then(r => r.ok)) { 
                if(isEditingSubject && editingSubjectId === id) huyCheDoSuaSubject();
                layDanhSachSubject(); layDanhSachSinhVien(currentPage); taiDuLieuFormSinhVien(); 
            } 
        }
    `;
    
    // Nối phần đầu (trước khi bị lỗi) + Hàm xoaSubject chuẩn + Phần đuôi (từ </script> trở đi)
    const beforeZone = html.substring(0, startIndex);
    const afterZone = html.substring(endIndex);
    
    fs.writeFileSync('./public/index.html', beforeZone + cleanXoaSubject + afterZone);
    console.log('🎉 XONG! Đã bứng trọn ổ code rác ở cuối file HTML. Cú pháp giờ đã mượt như lụa!');
} else {
    console.log('❌ Lỗi: Không tìm thấy khu vực cần sửa.');
}
