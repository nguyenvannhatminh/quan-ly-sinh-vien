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
exports.STUDENT = void 0;
const typeorm_1 = require("typeorm");
const tutor_entity_1 = require("./tutor.entity");
const subject_entity_1 = require("./subject.entity");
let STUDENT = class STUDENT {
};
exports.STUDENT = STUDENT;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], STUDENT.prototype, "SID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], STUDENT.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], STUDENT.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], STUDENT.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tutor_entity_1.TUTOR, (tutor) => tutor.students, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tutorId' }),
    __metadata("design:type", tutor_entity_1.TUTOR)
], STUDENT.prototype, "tutor", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => subject_entity_1.SUBJECT, (subject) => subject.students),
    (0, typeorm_1.JoinTable)({ name: 'student_subjects' }),
    __metadata("design:type", Array)
], STUDENT.prototype, "subjects", void 0);
exports.STUDENT = STUDENT = __decorate([
    (0, typeorm_1.Entity)()
], STUDENT);
//# sourceMappingURL=student.entity.js.map