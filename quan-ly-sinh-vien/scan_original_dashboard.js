const fs = require('fs');
const file = './public/index.html';

if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log("🔍 === KIỂM TRA ĐOẠN CODE GIAO DIỆN GỐC ===");
    
    // Tìm xem các từ khóa của giao diện gốc nằm ở đâu
    if (content.includes('Chào buổi sáng')) {
        console.log("✅ Đã tìm thấy giao diện gốc trong public/index.html!");
        
        // Cắt một đoạn text xung quanh để xem các ID của các ô số
        const index = content.indexOf('Chào buổi sáng');
        console.log("\n--- Bản xem trước code giao diện gốc ---");
        console.log(content.substring(index - 200, index + 1500));
    } else {
        console.log("❌ Không tìm thấy chữ 'Chào buổi sáng' trong index.html. Có thể nó nằm ở file khác?");
    }
} else {
    console.log("❌ Không tìm thấy file public/index.html");
}
