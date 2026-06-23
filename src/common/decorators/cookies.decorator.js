"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
var common_1 = require("@nestjs/common");
exports.Cookies = (0, common_1.createParamDecorator)(function (data, ctx) {
    var _a;
    var request = ctx.switchToHttp().getRequest();
    return data ? (_a = request.cookies) === null || _a === void 0 ? void 0 : _a[data] : request.cookies;
});
