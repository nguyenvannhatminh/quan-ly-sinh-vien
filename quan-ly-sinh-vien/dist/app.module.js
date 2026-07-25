"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const dashboard_module_1 = require("./dashboard/dashboard.module");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const sinh_vien_module_1 = require("./sinh-vien/sinh-vien.module");
const student_entity_1 = require("./entities/student.entity");
const tutor_entity_1 = require("./entities/tutor.entity");
const subject_entity_1 = require("./entities/subject.entity");
const user_entity_1 = require("./entities/user.entity");
const tutor_module_1 = require("./tutor/tutor.module");
const subject_module_1 = require("./subject/subject.module");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            dashboard_module_1.DashboardModule,
            typeorm_1.TypeOrmModule.forRoot({
                autoLoadEntities: true,
                type: 'mysql',
                host: 'localhost',
                port: 3306,
                username: 'root',
                password: '',
                database: 'quan_ly_sinh_vien',
                entities: [student_entity_1.STUDENT, tutor_entity_1.TUTOR, subject_entity_1.SUBJECT, user_entity_1.USER],
                synchronize: true,
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
            }),
            sinh_vien_module_1.SinhVienModule,
            tutor_module_1.TutorModule,
            subject_module_1.SubjectModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map