const fs = require('fs');

// 1. CHẶN Ở BACKEND (sinh-vien.service.ts)
const servicePath = './src/sinh-vien/sinh-vien.service.ts';
if (fs.existsSync(servicePath)) {
    let serviceCode = fs.readFileSync(servicePath, 'utf8');

    // Thêm BadRequestException vào import nếu chưa có
    if (!serviceCode.includes('BadRequestException')) {
        serviceCode = serviceCode.replace(
            "import { Injectable } from '@nestjs/common';",
            "import { Injectable, BadRequestException } from '@nestjs/common';"
        );
    }

    // Chèn logic validate điểm vào hàm calculateAcademic
    const validateLogic = `
  private calculateAcademic(diemSo: any): { gpa: number, xepLoai: string } {
    if (!diemSo || Object.keys(diemSo).length === 0) return { gpa: null, xepLoai: null };

    // Validate kiểm tra điểm từ 0 đến 10
    for (const [subId, val] of Object.entries(diemSo)) {
      if (val !== null && val !== undefined && val !== '') {
        const score = Number(val);
        if (isNaN(score) || score < 0 || score > 10) {
          throw new BadRequestException('Điểm số phải nằm trong khoảng từ 0.0 đến 10.0!');
        }
      }
    }
`;

    serviceCode = serviceCode.replace(/private calculateAcademic\(diemSo: any\):[\s\S]*?{/, validateLogic);
    fs.writeFileSync(servicePath, serviceCode);
    console.log('✅ Đã thêm chặn điểm 0-10 ở Backend!');
}

// 2. CHẶN Ở FRONTEND (public/index.html)
const indexPath = './public/index.html';
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    const newSubmitFn = `
    async function submitGrades() {
        const studentId = document.getElementById('currentGradeStudentId').value;
        const inputs = document.querySelectorAll('.score-input');
        const diemSo = {};
        let isValid = true;

        inputs.forEach(input => {
            const subId = input.getAttribute('data-subid');
            const val = input.value.trim();
            if (val !== '') {
                const score = parseFloat(val);
                if (isNaN(score) || score < 0 || score > 10) {
                    isValid = false;
                } else {
                    diemSo[subId] = score;
                }
            }
        });

        if (!isValid) {
            alert('⚠️ Điểm số không hợp lệ! Tất cả điểm phải nằm trong khoảng từ 0.0 đến 10.0.');
            return;
        }

        try {
            const res = await fetch('/sinh-vien/' + studentId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diemSo })
            });

            if (res.ok) {
                alert('🎉 Đã cập nhật điểm số và tự động xếp loại thành công!');
                closeModalGrade();
                if (typeof loadSinhVienList === 'function') loadSinhVienList();
                if (typeof updateDashboardStats === 'function') updateDashboardStats();
            } else {
                const errData = await res.json();
                alert('❌ ' + (errData.message || 'Không thể lưu điểm số!'));
            }
        } catch (err) {
            console.error('Lỗi khi gửi dữ liệu điểm:', err);
        }
    }
    `;

    // Thay thế hàm submitGrades cũ
    html = html.replace(/async function submitGrades\(\)[\s\S]*?^\s*}\s*}/m, newSubmitFn.trim());
    fs.writeFileSync(indexPath, html);
    console.log('✅ Đã thêm chặn điểm 0-10 ở Frontend!');
}
