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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tutor_entity_1 = require("./entities/tutor.entity");
let TutorService = class TutorService {
    constructor(tutorRepository) {
        this.tutorRepository = tutorRepository;
    }
    async create(createTutorDto) {
        const saved = await this.tutorRepository.save(createTutorDto);
        return Object.assign(Object.assign({}, saved), { id: saved.TID || saved.id });
    }
    async findAll() {
        const data = await this.tutorRepository.find();
        return data.map(item => (Object.assign(Object.assign({}, item), { id: item.TID || item.id })));
    }
    async findOne(id) {
        const item = await this.tutorRepository.findOne({
            where: [{ TID: id }, { id: id }]
        });
        if (item) {
            return Object.assign(Object.assign({}, item), { id: item.TID || item.id });
        }
        return null;
    }
    async update(id, updateTutorDto) {
        const { id: _, TID: __ } = updateTutorDto, updateData = __rest(updateTutorDto, ["id", "TID"]);
        await this.tutorRepository.update({ TID: id }, updateData).catch(() => { });
        await this.tutorRepository.update(id, updateData).catch(() => { });
        return this.findOne(id);
    }
    async remove(id) {
        await this.tutorRepository.delete({ TID: id }).catch(() => { });
        await this.tutorRepository.delete(id).catch(() => { });
        return { success: true };
    }
};
exports.TutorService = TutorService;
exports.TutorService = TutorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tutor_entity_1.Tutor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TutorService);
//# sourceMappingURL=tutor.service.js.map