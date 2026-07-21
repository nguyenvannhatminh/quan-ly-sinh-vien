const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // Tối ưu lại vị trí đặt thẻ script thư viện Chart.js lên hẳn phía trên đầu để đảm bảo tải trước
    if (html.includes('https://cdn.jsdelivr.net/npm/chart.js')) {
        html = html.replace('<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>', '');
    }
    html = html.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>');

    // Cập nhật mã hiển thị đồ thị chuyên nghiệp hơn, tự render trục tọa độ ngay cả khi data = 0
    const robustScript = `
    // --- DASHBOARD REALTIME CORE PRO ---
    async function updateDashboardStats() {
        try {
            console.log('🔄 Đang tải dữ liệu thống kê...');
            const res = await fetch('/dashboard/stats');
            if (!res.ok) throw new Error('Không gọi được API stats');
            const data = await res.json();
            
            document.getElementById('stat-students').innerText = data.totalStudents || 0;
            document.getElementById('stat-subjects').innerText = data.totalSubjects || 0;
            document.getElementById('stat-tutors').innerText = data.totalTutors || 0;
            
            const canvas = document.getElementById('dashboardChart');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            if (window.myDashboardChart) {
                window.myDashboardChart.destroy();
            }
            
            if (typeof Chart === 'undefined') {
                console.warn('⚠️ Chart.js chưa tải xong, đang thử lại sau 1 giây...');
                setTimeout(updateDashboardStats, 1000);
                return;
            }

            const chartLabels = data.chartData && data.chartData.length ? data.chartData.map(d => d.subjectName) : ['Toán', 'Lý', 'Hóa'];
            const chartValues = data.chartData && data.chartData.length ? data.chartData.map(d => d.count) : [0, 0, 0];
            
            window.myDashboardChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Số lượng sinh viên đăng ký',
                        data: chartValues,
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        borderColor: '#1D4ED8',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: '#F3F4F6' },
                            ticks: { stepSize: 1, color: '#6B7280' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#6B7280' }
                        }
                    }
                }
            });
            console.log('✅ Đã vẽ biểu đồ Dashboard thành công!');
        } catch (err) {
            console.error('❌ Lỗi tải dữ liệu Dashboard:', err);
        }
    }

    // Khởi chạy lập tức
    setTimeout(updateDashboardStats, 300);
    `;

    // Thay thế cụm script cũ bằng cụm script có log debug
    html = html.replace(/\/\/ --- DASHBOARD REALTIME CORE PRO ---[\s\S]*?<\/script>/, robustScript + '\n</script>');

    fs.writeFileSync(filePath, html);
    console.log('🎉 [SUCCESS] Đã nâng cấp luồng tải cấu trúc Biểu đồ hoàn chỉnh!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
