import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class STUDENT {
  @PrimaryColumn({ length: 10 })
  SID: string;

  @Column({ length: 30 })
  SNAME: string;

  @Column({ length: 30 })
  EMAIL: string;

  @Column({ length: 10 })
  Tutor_id: string;
}