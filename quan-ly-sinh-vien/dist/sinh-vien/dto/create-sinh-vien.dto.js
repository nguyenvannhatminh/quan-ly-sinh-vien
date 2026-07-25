"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSinhVienDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSinhVienDto {
}
exports.CreateSinhVienDto = CreateSinhVienDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên sinh viên không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên sinh viên phải là chuỗi ký tự' }),
    (0, class_validator_1.Length)(3, 50, { message: 'Tên sinh viên phải từ 3 đến 50 ký tự' }),
    __metadata("design:type", String)
], CreateSinhVienDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)({}, { message: 'Định dạng email sinh viên không hợp lệ' }),
    __metadata("design:type", String)
], CreateSinhVienDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại Việt Nam không hợp lệ' }),
    __metadata("design:type", String)
], CreateSinhVienDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)({ message: 'ID giảng viên phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateSinhVienDto.prototype, "tutorId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Danh sách ID môn học phải là một mảng số' }),
    (0, class_validator_1.IsInt)({ each: true, message: 'Mỗi ID môn học phải là số nguyên' }),
    __metadata("design:type", Array)
], CreateSinhVienDto.prototype, "subjectIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateSinhVienDto.prototype, "diemSo", void 0);
//# sourceMappingURL=create-sinh-vien.dto.js.map