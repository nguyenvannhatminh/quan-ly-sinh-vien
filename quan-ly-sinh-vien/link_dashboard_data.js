const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    const newLogic = `
    // --- DASHBOARD REALTIME CORE PRO ---
    async function updateDashboardStats() {
        try {
            console.log('🔄 Đang tải dữ liệu thống kê từ API chuẩn...');
            const res = await fetch('/dashboard/stats');
            if (!res.ok) throw new Error('Không gọi được API stats');
            const data = await res.json();
            
            // 1. Cập nhật ô Sinh viên toàn trường
            const statSv = document.getElementById('stat-sinh-vien');
            if (statSv) statSv.innerText = data.totalStudents || 0;
            
            // 2. Cập nhật ô Môn học đang mở
            const statSubj = document.getElementById('stat-subjects');
            if (statSubj) statSubj.innerText = data.totalSubjects || 0;
            
            // 3. Cập nhật ô Giảng viên (Quét thông minh qua nội dung thẻ)
            const statCards = document.querySelectorAll('.stats-card');
            statCards.forEach(card => {
                const h3 = card.querySelector('h3');
                if (h3 && card.innerText.includes('Giảng viên')) {
                    h3.innerText = data.totalTutors || 0;
                }
            });
            
            console.log('✅ Đã bơm dữ liệu vào Dashboard gốc thành công!');
        } catch (err) {
            console.error('❌ Lỗi tải dữ liệu Dashboard:', err);
        }
    }

    // Khởi chạy lập tức
    setTimeout(updateDashboardStats, 300);
    `;

    // Ghi đè logic cũ
    html = html.replace(/\/\/ --- DASHBOARD REALTIME CORE PRO ---[\s\S]*?<\/script>/, newLogic + '\n</script>');
    
    fs.writeFileSync(filePath, html);
    console.log('🎯 [SUCCESS] Đã kết nối Data Backend vào đúng các ID của giao diện gốc!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
