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
exports.SinhVien = void 0;
const typeorm_1 = require("typeorm");
const tutor_entity_1 = require("../../tutor/entities/tutor.entity");
const subject_entity_1 = require("../../subject/entities/subject.entity");
let SinhVien = class SinhVien {
};
exports.SinhVien = SinhVien;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SinhVien.prototype, "SID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SinhVien.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SinhVien.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], SinhVien.prototype, "diemSo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], SinhVien.prototype, "gpa", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SinhVien.prototype, "xepLoai", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tutor_entity_1.Tutor),
    (0, typeorm_1.JoinColumn)({ name: 'tutorId' }),
    __metadata("design:type", tutor_entity_1.Tutor)
], SinhVien.prototype, "tutor", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => subject_entity_1.Subject),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], SinhVien.prototype, "subjects", void 0);
exports.SinhVien = SinhVien = __decorate([
    (0, typeorm_1.Entity)('sinh_viens')
], SinhVien);
//# sourceMappingURL=sinh-vien.entity.js.map