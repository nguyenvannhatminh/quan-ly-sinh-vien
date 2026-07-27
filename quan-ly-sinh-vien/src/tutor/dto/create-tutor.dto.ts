import { IsNotEmpty, IsString, IsEmail, IsOptional, Matches } from 'class-validator';

export class CreateTutorDto {
  @IsNotEmpty({ message: 'Tên giảng viên không được để trống' })
  @IsString({ message: 'Tên giảng viên phải là chuỗi ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email giảng viên không đúng định dạng' })
  email: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại Việt Nam không hợp lệ' })
  phone?: string;
}
