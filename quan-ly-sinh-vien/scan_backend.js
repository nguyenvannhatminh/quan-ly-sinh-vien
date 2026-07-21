const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.controller.ts') || file.endsWith('.module.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

console.log("🔍 === DANH SÁCH CONTROLLER & MODULE BACKEND ===");
try {
    const files = walk('./src');
    files.forEach(f => console.log(`- ${f}`));
} catch (e) {
    console.log("❌ Không quét được thư mục src:", e.message);
}
