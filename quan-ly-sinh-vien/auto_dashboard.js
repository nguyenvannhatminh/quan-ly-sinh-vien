const fs = require('fs');
const path = require('path');

console.log('🤖 [Dashboard Builder] Bắt đầu quét hệ thống...');

// 1. Phân tích Entity Student & Subject để tìm mối quan hệ và tên thuộc tính
let studentRelationName = 'subjects';
let subjectNameProp = 'name';

if (fs.existsSync('./src/entities/student.entity.ts')) {
    const studentContent = fs.readFileSync('./src/entities/student.entity.ts', 'utf8');
    const match = studentContent.match(/([a-zA-Z0-9_]+)\s*:\s*SUBJECT\[\]/);
    if (match && match[1]) studentRelationName = match[1];
}

if (fs.existsSync('./src/entities/subject.entity.ts')) {
    const subjectContent = fs.readFileSync('./src/entities/subject.entity.ts', 'utf8');
    if (subjectContent.includes('tenMonHoc')) subjectNameProp = 'tenMonHoc';
    else if (subjectContent.includes('tenMon')) subjectNameProp = 'tenMon';
    else if (subjectContent.includes('title')) subjectNameProp = 'title';
}

console.log(`💡 Tìm thấy cấu trúc liên kết: Student.${studentRelationName} -> Subject.${subjectNameProp}`);

// 2. Tạo thư mục và viết file Dashboard Controller
if (!fs.existsSync('./src/dashboard')) fs.mkdirSync('./src/dashboard');

const controllerCode = `import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { STUDENT } from '../entities/student.entity';
import { TUTOR } from '../entities/tutor.entity';
import { SUBJECT } from '../entities/subject.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @InjectRepository(STUDENT) private studentRepo: Repository<STUDENT>,
    @InjectRepository(TUTOR) private tutorRepo: Repository<TUTOR>,
    @InjectRepository(SUBJECT) private subjectRepo: Repository<SUBJECT>,
  ) {}

  @Get('stats')
  async getStats() {
    const totalStudents = await this.studentRepo.count();
    const totalTutors = await this.tutorRepo.count();
    const totalSubjects = await this.subjectRepo.count();

    let chartData = [];
    try {
      const students = await this.studentRepo.find({ relations: ['${studentRelationName}'] });
      const subjectCounts = {};
      const allSubjects = await this.subjectRepo.find();
      
      allSubjects.forEach(s => {
        const name = s['${subjectNameProp}'] || 'Chưa rõ';
        subjectCounts[name] = 0;
      });

      students.forEach(st => {
        if (st['${studentRelationName}'] && Array.isArray(st['${studentRelationName}'])) {
          st['${studentRelationName}'].forEach(sub => {
            const name = sub['${subjectNameProp}'] || 'Chưa rõ';
            subjectCounts[name] = (subjectCounts[name] || 0) + 1;
          });
        }
      });

      chartData = Object.keys(subjectCounts).map(name => ({
        subjectName: name,
        count: subjectCounts[name]
      }));
    } catch (e) {
      const allSubjects = await this.subjectRepo.find();
      chartData = allSubjects.map(s => ({
        subjectName: s['${subjectNameProp}'] || 'Chưa rõ',
        count: 0
      }));
    }

    return { totalStudents, totalTutors, totalSubjects, chartData };
  }
}
`;

fs.writeFileSync('./src/dashboard/dashboard.controller.ts', controllerCode);

// 3. Viết file Dashboard Module
const moduleCode = `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { STUDENT } from '../entities/student.entity';
import { TUTOR } from '../entities/tutor.entity';
import { SUBJECT } from '../entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([STUDENT, TUTOR, SUBJECT])],
  controllers: [DashboardController],
})
export class DashboardModule {}
`;

fs.writeFileSync('./src/dashboard/dashboard.module.ts', moduleCode);
console.log('✅ Đã khởi tạo cấu trúc Backend Dashboard thành công!');

// 4. Đăng ký DashboardModule vào AppModule tự động
let appModule = fs.readFileSync('./src/app.module.ts', 'utf8');
if (!appModule.includes('DashboardModule')) {
    appModule = "import { DashboardModule } from './dashboard/dashboard.module';\n" + appModule;
    appModule = appModule.replace('imports: [', 'imports: [\n    DashboardModule,');
    fs.writeFileSync('./src/app.module.ts', appModule);
    console.log('🔗 Đã liên kết module mới vào AppModule!');
}

// 5. Cập nhật giao diện Frontend (public/index.html)
if (fs.existsSync('./public/index.html')) {
    let html = fs.readFileSync('./public/index.html', 'utf8');
    
    // Tải CDN Chart.js
    if (!html.includes('chart.js')) {
        html = html.replace('</head>', '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n</head>');
    }

    // HTML Giao diện Thống kê
    const dashboardHTML = `
    <!-- === KHU VỰC DASHBOARD THỐNG KÊ === -->
    <div id="dashboard-section" style="margin-bottom: 2rem; font-family: Arial, sans-serif;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, #3B82F6, #1D4ED8); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.08);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; font-weight: bold;">Tổng Số Sinh Viên</div>
                <div id="stat-students" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
            <div style="background: linear-gradient(135deg, #10B981, #047857); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.08);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; font-weight: bold;">Môn Học Hệ Thống</div>
                <div id="stat-subjects" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
            <div style="background: linear-gradient(135deg, #F59E0B, #B45309); color: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.08);">
                <div style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.85; font-weight: bold;">Giảng Viên Cố Vấn</div>
                <div id="stat-tutors" style="font-size: 2.5rem; font-weight: bold; margin-top: 0.5rem;">0</div>
            </div>
        </div>
        <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #E5E7EB;">
            <h3 style="margin-top: 0; margin-bottom: 1.25rem; color: #1F2937; font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem;">📊 Tỷ Lệ Đăng Ký Theo Từng Môn Học</h3>
            <div style="position: relative; height: 280px; width: 100%;">
                <canvas id="dashboardChart"></canvas>
            </div>
        </div>
    </div>
    <!-- =================================== -->`;

    // Nhét phần Dashboard vào đầu khu vực hiển thị (tìm container)
    if (!html.includes('id="dashboard-section"')) {
        if (html.includes('<div class="container')) {
            html = html.replace(/(<div class="container[^>]*>)/, `$1\n${dashboardHTML}`);
        } else {
            html = html.replace('<body>', `<body>\n<div style="max-width: 1200px; margin: 0 auto; padding: 1.5rem;">${dashboardHTML}</div>`);
        }
    }

    // JS Logic để fetch và vẽ biểu đồ realtime
    const frontendScript = `
    // --- DASHBOARD REALTIME CORE ---
    async function updateDashboardStats() {
        try {
            let res = await fetch('/api/dashboard/stats');
            if (!res.ok) res = await fetch('/dashboard/stats');
            const data = await res.json();
            
            document.getElementById('stat-students').innerText = data.totalStudents || 0;
            document.getElementById('stat-subjects').innerText = data.totalSubjects || 0;
            document.getElementById('stat-tutors').innerText = data.totalTutors || 0;
            
            const ctx = document.getElementById('dashboardChart').getContext('2d');
            if (window.myDashboardChart) window.myDashboardChart.destroy();
            
            window.myDashboardChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.chartData.map(d => d.subjectName),
                    datasets: [{
                        label: 'Số lượng sinh viên theo học',
                        data: data.chartData.map(d => d.count),
                        backgroundColor: 'rgba(59, 130, 246, 0.75)',
                        borderColor: '#1E40AF',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                }
            });
        } catch (err) {
            console.error('Lỗi tải dữ liệu Dashboard:', err);
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        updateDashboardStats();
        // Tự động reload dashboard khi thực hiện các hành động CUD dữ liệu sinh viên
        const nativeFetch = window.fetch;
        window.fetch = async function(...args) {
            const resp = await nativeFetch(...args);
            if (args[0] && (args[0].includes('sinh-vien') || args[0].includes('student'))) {
                setTimeout(updateDashboardStats, 400);
            }
            return resp;
        };
    });
    `;

    if (!html.includes('updateDashboardStats')) {
        html = html.replace('</body>', `<script>\n${frontendScript}\n</script>\n</body>`);
    }

    fs.writeFileSync('./public/index.html', html);
    console.log('🎨 Đã tiêm giao diện Cards & Biểu đồ Chart.js vào Frontend mượt mà!');
}

console.log('🎉 🎉 BINGO! Tính năng Dashboard Thống Kê hoàn thành 100%! Hãy khởi động lại NestJS.');
