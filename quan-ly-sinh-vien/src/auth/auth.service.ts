// Sửa trong src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // Đảm bảo hàm nhận vào 2 tham số rõ ràng
  async register(username: string, password?: string) {
    // Logic lưu user của bro ở đây
    return { message: 'Đăng ký thành công', username };
  }

  async login(username: string, password?: string) {
    // Logic check pass của bro ở đây
    let role = 'user';
    if (username === 'admin') role = 'admin';
    if (username === 'giaovu') role = 'giaovu';
    
    return { access_token: 'fake-jwt-token-12345', role, username };
  }
}