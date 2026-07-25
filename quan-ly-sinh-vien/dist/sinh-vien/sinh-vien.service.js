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
exports.SinhVienService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sinh_vien_entity_1 = require("./entities/sinh-vien.entity");
const tutor_entity_1 = require("../tutor/entities/tutor.entity");
const subject_entity_1 = require("../subject/entities/subject.entity");
let SinhVienService = class SinhVienService {
    constructor(svRepo, tutorRepo, subRepo) {
        this.svRepo = svRepo;
        this.tutorRepo = tutorRepo;
        this.subRepo = subRepo;
    }
    calculateAcademic(diemSo) {
        if (!diemSo || Object.keys(diemSo).length === 0)
            return { gpa: null, xepLoai: null };
        for (const [subId, val] of Object.entries(diemSo)) {
            if (val !== null && val !== undefined && val !== '') {
                const score = Number(val);
                if (isNaN(score) || score < 0 || score > 10) {
                    throw new common_1.BadRequestException('Điểm số phải nằm trong khoảng từ 0.0 đến 10.0!');
                }
            }
        }
        const scores = Object.values(diemSo).map(Number).filter(n => !isNaN(n));
        if (scores.length === 0)
            return { gpa: null, xepLoai: null };
        const total = scores.reduce((a, b) => a + b, 0);
        const gpa = Number((total / scores.length).toFixed(2));
        let xepLoai = 'Kém';
        if (gpa >= 9)
            xepLoai = 'Xuất sắc';
        else if (gpa >= 8)
            xepLoai = 'Giỏi';
        else if (gpa >= 6.5)
            xepLoai = 'Khá';
        else if (gpa >= 5)
            xepLoai = 'Trung bình';
        else
            xepLoai = 'Yếu';
        return { gpa, xepLoai };
    }
    async create(body) {
        const sv = this.svRepo.create({ name: body.name, email: body.email });
        if (body.diemSo) {
            sv.diemSo = body.diemSo;
            const { gpa, xepLoai } = this.calculateAcademic(body.diemSo);
            sv.gpa = gpa;
            sv.xepLoai = xepLoai;
        }
        if (body.tutorId)
            sv.tutor = { TID: body.tutorId };
        if (body.subjectIds)
            sv.subjects = body.subjectIds.map(id => ({ SubID: id }));
        return this.svRepo.save(sv);
    }
    async findAll(page = 1, limit = 5, search = '', tutorFilter, subjectFilter) {
        const skip = (page - 1) * limit;
        const qb = this.svRepo.createQueryBuilder('sv')
            .leftJoinAndSelect('sv.tutor', 'tutor')
            .leftJoinAndSelect('sv.subjects', 'subjects')
            .orderBy('sv.SID', 'DESC');
        if (search) {
            qb.andWhere('(sv.name LIKE :search OR sv.email LIKE :search OR CAST(sv.SID AS CHAR) LIKE :search)', { search: `%${search}%` });
        }
        if (tutorFilter && String(tutorFilter || '').trim() !== '') {
            const numTutor = Number(tutorFilter);
            if (!isNaN(numTutor) && numTutor > 0) {
                qb.andWhere('(tutor.TID = :numTutor OR tutor.TID = :numTutor)', { numTutor });
            }
            else {
                qb.andWhere('tutor.name LIKE :tutorName', { tutorName: `%${tutorFilter}%` });
            }
        }
        if (subjectFilter && String(subjectFilter || '').trim() !== '') {
            const numSub = Number(subjectFilter);
            if (!isNaN(numSub) && numSub > 0) {
                qb.andWhere('(subjects.SubID = :numSub OR subjects.SubID = :numSub)', { numSub });
            }
            else {
                qb.andWhere('subjects.name LIKE :subName', { subName: `%${subjectFilter}%` });
            }
        }
        qb.skip(skip).take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, lastPage: Math.ceil(total / limit) || 1 };
    }
    async update(id, body) {
        const sv = await this.svRepo.findOne({
            where: { SID: id },
            relations: { subjects: true }
        });
        if (!sv)
            return null;
        if (body.name)
            sv.name = body.name;
        if (body.email)
            sv.email = body.email;
        if (body.diemSo !== undefined) {
            sv.diemSo = body.diemSo;
            const { gpa, xepLoai } = this.calculateAcademic(body.diemSo);
            sv.gpa = gpa;
            sv.xepLoai = xepLoai;
        }
        if (body.tutorId !== undefined)
            sv.tutor = body.tutorId ? { TID: body.tutorId } : null;
        if (body.subjectIds !== undefined)
            sv.subjects = body.subjectIds.map(id => ({ SubID: id }));
        return this.svRepo.save(sv);
    }
    async remove(id) {
        return this.svRepo.delete(id);
    }
};
exports.SinhVienService = SinhVienService;
exports.SinhVienService = SinhVienService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sinh_vien_entity_1.SinhVien)),
    __param(1, (0, typeorm_1.InjectRepository)(tutor_entity_1.Tutor)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SinhVienService);
//# sourceMappingURL=sinh-vien.service.js.map