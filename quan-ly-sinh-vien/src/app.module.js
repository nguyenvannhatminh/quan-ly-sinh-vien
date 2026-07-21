"use strict";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var sinh_vien_module_1 = require("./sinh-vien/sinh-vien.module");
var student_entity_1 = require("./entities/student.entity");
var tutor_entity_1 = require("./entities/tutor.entity");
var subject_entity_1 = require("./entities/subject.entity");
var tutor_module_1 = require("./tutor/tutor.module");
var subject_module_1 = require("./subject/subject.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: '',
                    database: 'quan_ly_sinh_vien',
                    entities: [student_entity_1.STUDENT, tutor_entity_1.TUTOR, subject_entity_1.SUBJECT],
                    synchronize: true,
                }),
                sinh_vien_module_1.SinhVienModule,
                tutor_module_1.TutorModule,
                subject_module_1.SubjectModule,
            ],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
