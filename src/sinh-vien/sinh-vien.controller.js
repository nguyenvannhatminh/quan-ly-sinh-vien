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
exports.SinhVienController = void 0;
var common_1 = require("@nestjs/common");
var SinhVienController = /** @class */ (function () {
    function SinhVienController() {
    }
    // YÊU CẦU 1: COOKIE 
    SinhVienController.prototype.setCookie = function (response) {
        response.cookie('ma_sinh_vien', '24100084');
        return { message: 'Đã ghi mã sinh viên vào Cookie thành công!' };
    };
    SinhVienController.prototype.getCookie = function (session) {
        return { message: 'Đọc Cookie thành công!' };
    };
    // YÊU CẦU 2: SESSION
    SinhVienController.prototype.testSession = function (session) {
        // Tăng biến đếm số lần truy cập giống tài liệu NestJS
        session.visits = session.visits ? session.visits + 1 : 1;
        session.ma_sv = '24100084';
        return {
            message: 'Cài đặt Session thành công!',
            thong_tin_luu_tru: {
                sinh_vien: session.ma_sv,
                so_lan_ban_da_tai_trang_nay: session.visits
            }
        };
    };
    __decorate([
        (0, common_1.Get)('set'),
        __param(0, (0, common_1.Res)({ passthrough: true })),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SinhVienController.prototype, "setCookie", null);
    __decorate([
        (0, common_1.Get)('get'),
        __param(0, (0, common_1.Session)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SinhVienController.prototype, "getCookie", null);
    __decorate([
        (0, common_1.Get)('session-test'),
        __param(0, (0, common_1.Session)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], SinhVienController.prototype, "testSession", null);
    SinhVienController = __decorate([
        (0, common_1.Controller)('sinh-vien')
    ], SinhVienController);
    return SinhVienController;
}());
exports.SinhVienController = SinhVienController;
