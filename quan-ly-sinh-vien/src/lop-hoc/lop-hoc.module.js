"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LopHocModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var lop_hoc_service_1 = require("./lop-hoc.service");
var lop_hoc_controller_1 = require("./lop-hoc.controller");
var lop_hoc_entity_1 = require("./entities/lop-hoc.entity");
var LopHocModule = /** @class */ (function () {
    function LopHocModule() {
    }
    LopHocModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([lop_hoc_entity_1.LopHoc])],
            controllers: [lop_hoc_controller_1.LopHocController],
            providers: [lop_hoc_service_1.LopHocService],
        })
    ], LopHocModule);
    return LopHocModule;
}());
exports.LopHocModule = LopHocModule;
