import { PartialType } from '@nestjs/mapped-types';
import { CreateLopHocDto } from './create-lop-hoc.dto';

export class UpdateLopHocDto extends PartialType(CreateLopHocDto) {}
