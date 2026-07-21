const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('./public/index.html', 'utf8');

// Danh sách 6 biến bị đúp gây nghẽn toàn bộ hệ thống JavaScript
const targetVars = [
    'listTutorBoNhoDem', 'isEditingTutor', 'editingTutorId',
    'listSubjectBoNhoDem', 'isEditingSubject', 'editingSubjectId'
];

// Dùng \s+ để hốt trọn ổ mọi loại khoảng trắng dị dạng bọc quanh biến
targetVars.forEach(v => {
    const regex1 = new RegExp(`(let|const|var)\\s+${v}\\s*=[\\s\\S]*?;`, 'g');
    html = html.replace(regex1, '');
    const regex2 = new RegExp(`(let|const|var)\\s+${v}\\s*;`, 'g');
    html = html.replace(regex2, '');
});

// Tiêm lại an toàn bằng từ khóa 'var' ngay sau thẻ <script> đầu tiên
html = html.replace(/<script[\s\S]*?>/, match => match + `
        var listTutorBoNhoDem = []; var isEditingTutor = false; var editingTutorId = null;
        var listSubjectBoNhoDem = []; var isEditingSubject = false; var editingSubjectId = null;
`);

fs.writeFileSync('./public/index.html', html);

// Tiến hành chụp X-quang thẩm định lại toàn bộ file bằng bộ máy ảo VM chuyên sâu
try {
    const freshHtml = fs.readFileSync('./public/index.html', 'utf8');
    const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
    let match;
    let count = 0;
    let totalErrors = 0;

    while ((match = scriptRegex.exec(freshHtml)) !== null) {
        count++;
        try {
            new vm.Script(match[1], { filename: `Thẻ Script số ${count}` });
        } catch (e) {
            totalErrors++;
            console.log(`\n❌ [PHÁT HIỆN LỖI CÚ PHÁP CÒN SÓT] ở Thẻ Script số ${count}:`);
            console.log(e.stack ? e.stack.split('\n').slice(0, 4).join('\n') : e.message);
        }
    }

    if (totalErrors === 0) {
        console.log('\n🎉 [THÀNH CÔNG RỰC RỠ]: Toàn bộ lỗi cú pháp đã bị xóa sổ hoàn toàn! File sạch 100%.');
    }
} catch (err) {
    console.log("Không thể thẩm định file:", err.message);
}
