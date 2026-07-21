import { IsNotEmpty, IsString, IsEmail, IsOptional, Length, Matches, IsInt, IsArray } from 'class-validator';

export class CreateSinhVienDto {
  @IsNotEmpty({ message: 'Tên sinh viên không được để trống' })
  @IsString({ message: 'Tên sinh viên phải là chuỗi ký tự' })
  @Length(3, 50, { message: 'Tên sinh viên phải từ 3 đến 50 ký tự' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Định dạng email sinh viên không hợp lệ' })
  email?: string;

  @IsOptional()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, { message: 'Số điện thoại Việt Nam không hợp lệ' })
  phone?: string;

  @IsOptional()
  @IsInt({ message: 'ID giảng viên phải là số nguyên' })
  tutorId?: number;

  @IsOptional()
  @IsArray({ message: 'Danh sách ID môn học phải là một mảng số' })
  @IsInt({ each: true, message: 'Mỗi ID môn học phải là số nguyên' })
  subjectIds?: number[];

  @IsOptional()
  diemSo?: any;
}