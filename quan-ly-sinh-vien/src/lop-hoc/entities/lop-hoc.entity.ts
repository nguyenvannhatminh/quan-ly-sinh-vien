import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('Lop')
export class LopHoc {
  @PrimaryColumn()
  MaLop: string;

  @Column()
  TenLop: string;

  @Column()
  MaKhoa: string;
}

