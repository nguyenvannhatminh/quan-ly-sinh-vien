"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    constructor() {
        this.tutors = [
            { TID: 1, name: 'TS. Nguyễn Văn A' },
            { TID: 2, name: 'ThS. Trần Thị B' }
        ];
        this.subjects = [
            { SubID: 1, name: 'Lập trình Web' },
            { SubID: 2, name: 'Cơ sở dữ liệu' }
        ];
        this.sinhViens = [
            { SID: 1001, name: 'Lê Văn C', email: 'c@karl.edu.vn', tutorId: 1, subjectIds: [1, 2] },
            { SID: 1002, name: 'Phạm Thị D', email: 'd@karl.edu.vn', tutorId: 2, subjectIds: [1] }
        ];
        this.nextSid = 1003;
        this.nextTid = 3;
        this.nextSubid = 3;
    }
    login(username) {
        let role = 'user';
        if (username === 'admin')
            role = 'admin';
        if (username === 'giaovu')
            role = 'giaovu';
        return { access_token: 'fake-jwt-token-12345', role: role, username: username };
    }
    getTutors() { return this.tutors; }
    addTutor(name) {
        const t = { TID: this.nextTid++, name };
        this.tutors.push(t);
        return t;
    }
    deleteTutor(id) {
        this.tutors = this.tutors.filter(t => t.TID !== id);
        return { success: true };
    }
    getSubjects() { return this.subjects; }
    addSubject(name) {
        const s = { SubID: this.nextSubid++, name };
        this.subjects.push(s);
        return s;
    }
    deleteSubject(id) {
        this.subjects = this.subjects.filter(s => s.SubID !== id);
        return { success: true };
    }
    getSinhViens(page = 1, limit = 5, search = '') {
        let filtered = this.sinhViens;
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(sv => sv.name.toLowerCase().includes(s) || sv.SID.toString().includes(s));
        }
        const total = filtered.length;
        const lastPage = Math.ceil(total / limit);
        const start = (page - 1) * limit;
        const paginated = filtered.slice(start, start + limit).map(sv => {
            const tutor = this.tutors.find(t => t.TID === sv.tutorId) || null;
            const subjects = this.subjects.filter(sub => (sv.subjectIds || []).includes(sub.SubID));
            return Object.assign(Object.assign({}, sv), { tutor, subjects });
        });
        return { data: paginated, total, page: Number(page), lastPage };
    }
    addSinhVien(data) {
        const sv = {
            SID: this.nextSid++,
            name: data.name,
            email: data.email,
            tutorId: data.tutorId,
            subjectIds: data.subjectIds || []
        };
        this.sinhViens.unshift(sv);
        return sv;
    }
    updateSinhVien(id, data) {
        const index = this.sinhViens.findIndex(s => s.SID === id);
        if (index !== -1) {
            this.sinhViens[index] = Object.assign(Object.assign({}, this.sinhViens[index]), data);
            return this.sinhViens[index];
        }
        return null;
    }
    deleteSinhVien(id) {
        this.sinhViens = this.sinhViens.filter(s => s.SID !== id);
        return { success: true };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map