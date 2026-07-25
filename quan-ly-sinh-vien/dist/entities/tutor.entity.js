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
exports.TUTOR = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("./student.entity");
let TUTOR = class TUTOR {
};
exports.TUTOR = TUTOR;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TUTOR.prototype, "TID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TUTOR.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], TUTOR.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TUTOR.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_entity_1.STUDENT, (student) => student.tutor),
    __metadata("design:type", Array)
], TUTOR.prototype, "students", void 0);
exports.TUTOR = TUTOR = __decorate([
    (0, typeorm_1.Entity)()
], TUTOR);
//# sourceMappingURL=tutor.entity.js.map