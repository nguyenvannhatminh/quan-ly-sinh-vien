const fs = require('fs');

console.log("\n📦 === KIỂM TRA IMPORTS TRONG APP.MODULE ===");
if (fs.existsSync('./src/app.module.ts')) {
    const appModule = fs.readFileSync('./src/app.module.ts', 'utf8');
    console.log(appModule.split('\n').slice(0, 20).join('\n'));
} else {
    console.log("❌ Không thấy src/app.module.ts");
}

console.log("\n🎓 === KIỂM TRA CONSTRUCTOR TRONG SINH-VIEN.CONTROLLER ===");
if (fs.existsSync('./src/sinh-vien/sinh-vien.controller.ts')) {
    const svController = fs.readFileSync('./src/sinh-vien/sinh-vien.controller.ts', 'utf8');
    const lines = svController.split('\n');
    const constructorIndex = lines.findIndex(l => l.includes('constructor'));
    if (constructorIndex !== -1) {
        console.log(lines.slice(constructorIndex, constructorIndex + 10).join('\n'));
    } else {
        console.log(lines.slice(0, 30).join('\n'));
    }
} else {
    console.log("❌ Không thấy src/sinh-vien/sinh-vien.controller.ts");
}
