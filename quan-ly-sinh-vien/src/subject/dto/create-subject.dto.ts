import { IsNotEmpty, IsString, IsInt, Min, Max, Length } from 'class-validator';

export class CreateSubjectDto {
  @IsNotEmpty({ message: 'Mã môn học không được để trống' })
  @IsString()
  @Length(5, 10, { message: 'Mã môn học phải từ 5 đến 10 ký tự' })
  subjectCode: string;

  @IsNotEmpty({ message: 'Tên môn học không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Số tín chỉ không được để trống' })
  @IsInt({ message: 'Số tín chỉ phải là số nguyên' })
  @Min(1, { message: 'Môn học tối thiểu phải có 1 tín chỉ' })
  @Max(10, { message: 'Môn học tối đa chỉ có 10 tín chỉ' })
  credits: number;
}
