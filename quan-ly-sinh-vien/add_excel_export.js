const fs = require('fs');
const filePath = './public/index.html';

if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Thêm thư viện SheetJS vào <head> nếu chưa có
    if (!html.includes('xlsx.full.min.js')) {
        html = html.replace('</head>', `  <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>\n</head>`);
    }

    // 2. Thêm nút [📥 Xuất Excel] bên cạnh nút Tải lại ở góc trên
    if (!html.includes('exportToExcel()')) {
        html = html.replace(
            /(<button[^>]*onclick=["'](?:loadSinhVienList|location.reload)\(\)["'][^>]*>.*?Tải lại.*?<\/button>)/gi,
            `<button onclick="exportToExcel()" style="background:#10B981; color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-weight:600; margin-right:8px; display:inline-flex; align-items:center; gap:6px;">📥 Xuất Excel</button> $1`
        );
    }

    // 3. Thêm hàm xuất file Excel hoàn chỉnh
    const exportScript = `
    <script>
    async function exportToExcel() {
        try {
            // Lấy toàn bộ danh sách sinh viên không phân trang
            const res = await fetch('/sinh-vien?page=1&limit=1000');
            const result = await res.json();
            const students = result.data || [];

            if (students.length === 0) {
                alert('⚠️ Chưa có dữ liệu sinh viên nào để xuất!');
                return;
            }

            // Định dạng dữ liệu đẹp đẽ trước khi xuất Excel
            const excelData = students.map((sv, index) => {
                const subjectsList = sv.subjects ? sv.subjects.map(s => s.name).join(', ') : 'Chưa đăng ký';
                const tutorName = sv.tutor ? sv.tutor.name : 'Chưa phân công';

                return {
                    'STT': index + 1,
                    'Mã SV (SID)': sv.SID,
                    'Họ và Tên': sv.name,
                    'Email': sv.email || 'N/A',
                    'Cố vấn Học tập': tutorName,
                    'Môn học Đăng ký': subjectsList,
                    'Điểm TB (GPA)': sv.gpa !== null && sv.gpa !== undefined ? sv.gpa : 'Chưa có',
                    'Xếp loại': sv.xepLoai || 'Chưa có'
                };
            });

            // Tạo Workbook & Worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            // Tự động căn chỉnh độ rộng cột
            const columnWidths = [
                { wch: 6 },  // STT
                { wch: 12 }, // Mã SV
                { wch: 22 }, // Họ và Tên
                { wch: 28 }, // Email
                { wch: 20 }, // Cố vấn
                { wch: 35 }, // Môn học
                { wch: 15 }, // GPA
                { wch: 15 }  // Xếp loại
            ];
            worksheet['!cols'] = columnWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Sinh Viên');

            // Tạo tên file kèm ngày giờ
            const today = new Date().toISOString().split('T')[0];
            const fileName = \`Danh_Sach_Sinh_Vien_\${today}.xlsx\`;

            // Tải file xuống máy
            XLSX.writeFile(workbook, fileName);
            alert('🎉 Đã xuất file Excel thành công!');

        } catch (err) {
            console.error('Lỗi khi xuất Excel:', err);
            alert('❌ Có lỗi xảy ra khi xuất file Excel!');
        }
    }
    </script>
    `;

    // Chèn script trước </body>
    if (!html.includes('function exportToExcel()')) {
        html = html.replace('</body>', `${exportScript}\n</body>`);
    }

    fs.writeFileSync(filePath, html);
    console.log('✅ Đã tích hợp thành công nút & hàm [📥 Xuất Excel]!');
} else {
    console.log('❌ Không tìm thấy public/index.html');
}
