import { IsString, IsOptional } from 'class-validator';

export class UpdateSinhVienDto {
  @IsString({ message: 'Tên sinh viên phải là một chuỗi chữ!' })
  @IsOptional()
  name?: string;

  @IsOptional()
  diemSo?: any;
}