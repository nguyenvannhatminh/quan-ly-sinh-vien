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
exports.CreateTutorDto = void 0;
const class_validator_1 = require("class-validator");
class CreateTutorDto {
}
exports.CreateTutorDto = CreateTutorDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên giảng viên không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên giảng viên phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateTutorDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email giảng viên không đúng định dạng' }),
    __metadata("design:type", String)
], CreateTutorDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại Việt Nam không hợp lệ' }),
    __metadata("design:type", String)
], CreateTutorDto.prototype, "phone", void 0);
//# sourceMappingURL=create-tutor.dto.js.map