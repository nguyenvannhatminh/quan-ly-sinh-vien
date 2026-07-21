const fs = require('fs');

const filePath = './public/index.html';
if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Tối ưu lại toàn bộ khối HTML Dashboard (Thêm margin-left để né Sidebar và sửa style)
    const optimizedDashboardHTML = `
    <!-- === KHU VỰC DASHBOARD THỐNG KÊ (ĐÃ FIX LAYOUT) === -->
    <div id="dashboard-section" style="margin-left: 270px; margin-right: 20px; margin-top: 20px; margin-bottom: 2rem; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; font-weight: 600;">Tổng Số Sinh Viên</div>
                <div id="stat-students" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
            <div style="background: linear-gradient(135deg, #10B981, #047857); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; font-weight: 600;">Môn Học Hệ Thống</div>
                <div id="stat-subjects" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
            <div style="background: linear-gradient(135deg, #F59E0B, #B45309); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; font-weight: 600;">Giảng Viên Cố Vấn</div>
                <div id="stat-tutors" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
        </div>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <h3 style="margin-top: 0; margin-bottom: 1.25rem; color: #1F2937; font-size: 1.15rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">📊 Tỷ Lệ Đăng Ký Theo Từng Môn Học</h3>
            <div style="position: relative; height: 320px; width: 100%;">
                <canvas id="dashboardChart"></canvas>
            </div>
        </div>
    </div>
    <!-- =================================== -->`;

    // Xóa bỏ cụm dashboard cũ nếu có để tránh trùng lặp
    html = html.replace(/<!-- === KHU VỰC DASHBOARD THỐNG KÊ === -->[\s\S]*?<!-- =================================== -->/g, '');
    html = html.replace(/<!-- === KHU VỰC DASHBOARD THỐNG KÊ \(ĐÃ FIX LAYOUT\) === -->[\s\S]*?<!-- =================================== -->/g, '');

    // Chèn cụm mới vào ngay sau thẻ mở body (hoặc vị trí tối ưu)
    html = html.replace('<body>', `<body>\n${optimizedDashboardHTML}`);

    // 2. Cập nhật mã Script Frontend để đảm bảo Chart.js chạy chuẩn sau khi CDN load xong
    const optimizedScript = `
    // --- DASHBOARD REALTIME CORE PRO ---
    async function updateDashboardStats() {
        try {
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
                console.error('Đang chờ thư viện Chart.js tải...');
                setTimeout(updateDashboardStats, 1000);
                return;
            }

            const chartLabels = data.chartData && data.chartData.length ? data.chartData.map(d => d.subjectName) : ['Chưa có dữ liệu'];
            const chartValues = data.chartData && data.chartData.length ? data.chartData.map(d => d.count) : [0];
            
            window.myDashboardChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Số lượng sinh viên',
                        data: chartValues,
                        backgroundColor: 'rgba(59, 130, 246, 0.85)',
                        borderColor: '#1D4ED8',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false
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
        } catch (err) {
            console.error('Lỗi tải dữ liệu Dashboard:', err);
        }
    }

    // Khởi chạy khi trang sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(updateDashboardStats, 500));
    } else {
        setTimeout(updateDashboardStats, 500);
    }
    `;

    // Xóa script dashboard cũ để ghi đè sạch sẽ
    html = html.replace(/\/\/ --- DASHBOARD REALTIME CORE ---[\s\S]*?\/\/ Tự động reload dashboard khi thực hiện các hành động CUD dữ liệu sinh viên/g, '');
    
    // Tiêm script mới vào trước </body>
    if (!html.includes('updateDashboardStats')) {
        html = html.replace('</body>', `<script>\n${optimizedScript}\n</script>\n</body>`);
    }

    fs.writeFileSync(filePath, html);
    console.log('🚀 [SUCCESS] Đã căn lề chuẩn tránh Sidebar và tối ưu script vẽ biểu đồ!');
} else {
    console.log('❌ Không tìm thấy file public/index.html');
}
