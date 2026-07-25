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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sinh_vien_entity_1 = require("../sinh-vien/entities/sinh-vien.entity");
const tutor_entity_1 = require("../tutor/entities/tutor.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
let DashboardController = class DashboardController {
    constructor(studentRepo, tutorRepo, subjectRepo) {
        this.studentRepo = studentRepo;
        this.tutorRepo = tutorRepo;
        this.subjectRepo = subjectRepo;
    }
    async getStats() {
        const totalStudents = await this.studentRepo.count();
        const totalTutors = await this.tutorRepo.count();
        const totalSubjects = await this.subjectRepo.count();
        let chartData = [];
        try {
            const students = await this.studentRepo.find({ relations: { subjects: true } });
            const allSubjects = await this.subjectRepo.find();
            const subjectCounts = {};
            allSubjects.forEach(s => {
                const name = s['name'] || s['tenMonHoc'] || s['tenMon'] || 'Chưa rõ';
                subjectCounts[name] = 0;
            });
            students.forEach(st => {
                if (st.subjects && Array.isArray(st.subjects)) {
                    st.subjects.forEach(sub => {
                        const name = sub['name'] || sub['tenMonHoc'] || sub['tenMon'] || 'Chưa rõ';
                        if (subjectCounts[name] !== undefined) {
                            subjectCounts[name] += 1;
                        }
                        else {
                            subjectCounts[name] = 1;
                        }
                    });
                }
            });
            chartData = Object.keys(subjectCounts).map(name => ({
                subjectName: name,
                count: subjectCounts[name]
            }));
        }
        catch (e) {
            console.error('Lỗi tính toán biểu đồ:', e);
            try {
                const allSubjects = await this.subjectRepo.find();
                chartData = allSubjects.map(s => ({
                    subjectName: s['name'] || s['tenMonHoc'] || s['tenMon'] || 'Chưa rõ',
                    count: 0
                }));
            }
            catch (err) {
                chartData = [];
            }
        }
        return { totalStudents, totalTutors, totalSubjects, chartData };
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
exports.DashboardController = DashboardController = __decorate([
    (0, common_1.Controller)('dashboard'),
    __param(0, (0, typeorm_1.InjectRepository)(sinh_vien_entity_1.SinhVien)),
    __param(1, (0, typeorm_1.InjectRepository)(tutor_entity_1.Tutor)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map