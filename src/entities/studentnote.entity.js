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
exports.STUDENT_NOTE = void 0;
var typeorm_1 = require("typeorm");
var student_entity_1 = require("./student.entity");
var note_entity_1 = require("./note.entity");
var STUDENT_NOTE = /** @class */ (function () {
    function STUDENT_NOTE() {
    }
    __decorate([
        (0, typeorm_1.PrimaryColumn)({ length: 10 }),
        __metadata("design:type", String)
    ], STUDENT_NOTE.prototype, "SID", void 0);
    __decorate([
        (0, typeorm_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], STUDENT_NOTE.prototype, "NOTE_ID", void 0);
    __decorate([
        (0, typeorm_1.Column)({ length: 20, default: 'PENDING' }),
        __metadata("design:type", String)
    ], STUDENT_NOTE.prototype, "STATUS", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return student_entity_1.STUDENT; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({ name: 'SID' }),
        __metadata("design:type", student_entity_1.STUDENT)
    ], STUDENT_NOTE.prototype, "student", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return note_entity_1.NOTE; }, { onDelete: 'CASCADE' }),
        (0, typeorm_1.JoinColumn)({ name: 'NOTE_ID' }),
        __metadata("design:type", note_entity_1.NOTE)
    ], STUDENT_NOTE.prototype, "note", void 0);
    STUDENT_NOTE = __decorate([
        (0, typeorm_1.Entity)()
    ], STUDENT_NOTE);
    return STUDENT_NOTE;
}());
exports.STUDENT_NOTE = STUDENT_NOTE;
