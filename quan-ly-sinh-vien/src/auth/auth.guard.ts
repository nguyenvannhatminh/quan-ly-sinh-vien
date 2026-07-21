import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Bro chưa đăng nhập hoặc thiếu Token rồi!');
    }
    
    try {
      // Xác thực token xem có đúng Secret Key không, có bị hết hạn không
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'ANH_EM_FULLSTACK_CHINH_PHUC_NESTJS_2026',
      });
      // Đính kèm thông tin user vào request để dùng nếu cần
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Token đểu hoặc hết hạn rồi bro ơi!');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
