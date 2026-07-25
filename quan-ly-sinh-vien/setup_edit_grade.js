const fs = require('fs');

const servicePath = './src/sinh-vien/sinh-vien.service.ts';
const controllerPath = './src/sinh-vien/sinh-vien.controller.ts';

// 1. CẬP NHẬT SERVICE
if (fs.existsSync(servicePath)) {
    let serviceCode = fs.readFileSync(servicePath, 'utf8');

    // Thêm hoặc cập nhật hàm update cho SinhVienService
    const updateServiceMethod = `
  async update(id: number, updateDto: any) {
    const sv = await this.sinhVienRepository.findOne({ 
      where: { SID: id },
      relations: ['subjects', 'tutor'] 
    });
    if (!sv) {
      throw new NotFoundException('Không tìm thấy sinh viên');
    }

    if (updateDto.name !== undefined) sv.name = updateDto.name;
    if (updateDto.email !== undefined) sv.email = updateDto.email;
    
    // Cập nhật Cố vấn
    if (updateDto.tutorId !== undefined) {
      sv.tutorId = updateDto.tutorId ? Number(updateDto.tutorId) : null;
    }

    // Cập nhật Môn học
    if (Array.isArray(updateDto.subjectIds)) {
      sv.subjects = updateDto.subjectIds.map((subId) => ({ SubID: Number(subId) } as any));
    }

    // Cập nhật Điểm số & Tự động xếp loại nếu có truyền điểm
    if (updateDto.diemSo !== undefined) {
      const diem = Number(updateDto.diemSo);
      sv.diemSo = diem;
      sv.gpa = +(diem / 2.5).toFixed(2); // Quy đổi thang 4
      if (diem >= 8.5) sv.xepLoai = 'Giỏi';
      else if (diem >= 7.0) sv.xepLoai = 'Khá';
      else if (diem >= 5.0) sv.xepLoai = 'Trung bình';
      else sv.xepLoai = 'Yếu';
    }

    return await this.sinhVienRepository.save(sv);
  }
`;

    if (!serviceCode.includes('async update(')) {
        // Chèn hàm update vào trước dấu đóng ngoặc cuối cùng của class
        const lastBraceIndex = serviceCode.lastIndexOf('}');
        serviceCode = serviceCode.substring(0, lastBraceIndex) + updateServiceMethod + '\n}';
    } else {
        // Thay thế hàm update cũ bằng hàm mới chuẩn hoá
        serviceCode = serviceCode.replace(/async update\([\s\S]*?\n  \}/, updateServiceMethod.trim());
    }

    fs.writeFileSync(servicePath, serviceCode, 'utf8');
    console.log('✅ Đã cập nhật SinhVienService (Hỗ trợ Update & Nhập điểm)');
}

// 2. CẬP NHẬT CONTROLLER
if (fs.existsSync(controllerPath)) {
    let controllerCode = fs.readFileSync(controllerPath, 'utf8');

    const updateControllerMethod = `
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: any) {
    return this.sinhVienService.update(+id, updateDto);
  }

  @Put(':id')
  async updatePut(@Param('id') id: string, @Body() updateDto: any) {
    return this.sinhVienService.update(+id, updateDto);
  }
`;

    if (!controllerCode.includes('@Patch(\':id\')') && !controllerCode.includes('@Put(\':id\')')) {
        const lastBraceIndex = controllerCode.lastIndexOf('}');
        controllerCode = controllerCode.substring(0, lastBraceIndex) + updateControllerMethod + '\n}';
    }

    fs.writeFileSync(controllerPath, controllerCode, 'utf8');
    console.log('✅ Đã cập nhật SinhVienController (API PATCH/PUT /sinh-vien/:id)');
}

