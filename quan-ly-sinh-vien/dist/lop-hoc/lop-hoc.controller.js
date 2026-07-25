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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LopHocController = void 0;
const common_1 = require("@nestjs/common");
const lop_hoc_service_1 = require("./lop-hoc.service");
const create_lop_hoc_dto_1 = require("./dto/create-lop-hoc.dto");
const update_lop_hoc_dto_1 = require("./dto/update-lop-hoc.dto");
let LopHocController = class LopHocController {
    constructor(lopHocService) {
        this.lopHocService = lopHocService;
    }
    create(createLopHocDto) {
        return this.lopHocService.create(createLopHocDto);
    }
    findAll() {
        return this.lopHocService.findAll();
    }
    findOne(id) {
        return this.lopHocService.findOne(id);
    }
    update(id, updateLopHocDto) {
        return this.lopHocService.update(id, updateLopHocDto);
    }
    remove(id) {
        return this.lopHocService.remove(id);
    }
};
exports.LopHocController = LopHocController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lop_hoc_dto_1.CreateLopHocDto]),
    __metadata("design:returntype", void 0)
], LopHocController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LopHocController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LopHocController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_lop_hoc_dto_1.UpdateLopHocDto]),
    __metadata("design:returntype", void 0)
], LopHocController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LopHocController.prototype, "remove", null);
exports.LopHocController = LopHocController = __decorate([
    (0, common_1.Controller)('lop-hoc'),
    __metadata("design:paramtypes", [lop_hoc_service_1.LopHocService])
], LopHocController);
//# sourceMappingURL=lop-hoc.controller.js.map