const fs = require('fs');
const vm = require('vm');
const html = fs.readFileSync('./public/index.html', 'utf8');
const matches = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/g);

if (matches) {
    matches.forEach((scriptTag, index) => {
        const code = scriptTag.replace(/<script[\s\S]*?>|<\/script>/g, '');
        console.log(`\n🔍 === KIỂM TRA LỖI CÚ PHÁP THẺ SCRIPT SỐ ${index + 1} ===`);
        try {
            new vm.Script(code, { filename: `script_so_${index + 1}.js` });
            console.log("✅ Cú pháp mượt mà, không có lỗi Syntax!");
        } catch (e) {
            console.log("❌ PHÁT HIỆN LỖI CÚ PHÁP CHẾT NGƯỜI TẠI ĐÂY:");
            const stack = e.stack.split('\n');
            console.log(stack[0]);
            console.log(stack[1]);
            console.log(stack[2]);
        }
    });
} else {
    console.log("❌ Không tìm thấy thẻ script nào!");
}
