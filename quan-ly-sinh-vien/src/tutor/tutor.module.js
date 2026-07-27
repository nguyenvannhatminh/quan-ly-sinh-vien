"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var tutor_entity_1 = require("../entities/tutor.entity");
var tutor_service_1 = require("./tutor.service");
var tutor_controller_1 = require("./tutor.controller");
var TutorModule = /** @class */ (function () {
    function TutorModule() {
    }
    TutorModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([tutor_entity_1.TUTOR])],
            controllers: [tutor_controller_1.TutorController],
            providers: [tutor_service_1.TutorService],
            exports: [tutor_service_1.TutorService]
        })
    ], TutorModule);
    return TutorModule;
}());
exports.TutorModule = TutorModule;
