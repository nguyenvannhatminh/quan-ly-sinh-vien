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
exports.SUBJECT = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
let SUBJECT = class SUBJECT {
};
exports.SUBJECT = SUBJECT;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SUBJECT.prototype, "SubID", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], SUBJECT.prototype, "subjectCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SUBJECT.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SUBJECT.prototype, "credits", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => student_entity_1.STUDENT, (student) => student.subjects),
    __metadata("design:type", Array)
], SUBJECT.prototype, "students", void 0);
exports.SUBJECT = SUBJECT = __decorate([
    (0, typeorm_1.Entity)()
], SUBJECT);
//# sourceMappingURL=subject.entity.js.map