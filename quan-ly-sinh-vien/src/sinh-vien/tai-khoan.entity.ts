import { Entity, Column, PrimaryColumn } from 'typeorm';
@Entity('TaiKhoan')
export class TaiKhoanEntity {
  @PrimaryColumn()
  username: string;
  @Column()
  password_hash: string;
}
