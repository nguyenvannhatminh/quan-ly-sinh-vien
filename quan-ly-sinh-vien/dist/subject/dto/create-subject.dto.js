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
exports.CreateSubjectDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSubjectDto {
}
exports.CreateSubjectDto = CreateSubjectDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Mã môn học không được để trống' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(5, 10, { message: 'Mã môn học phải từ 5 đến 10 ký tự' }),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "subjectCode", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên môn học không được để trống' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSubjectDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Số tín chỉ không được để trống' }),
    (0, class_validator_1.IsInt)({ message: 'Số tín chỉ phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'Môn học tối thiểu phải có 1 tín chỉ' }),
    (0, class_validator_1.Max)(10, { message: 'Môn học tối đa chỉ có 10 tín chỉ' }),
    __metadata("design:type", Number)
], CreateSubjectDto.prototype, "credits", void 0);
//# sourceMappingURL=create-subject.dto.js.map