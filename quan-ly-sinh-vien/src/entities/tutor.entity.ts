import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { STUDENT } from "./student.entity";

@Entity()
export class TUTOR {
  @PrimaryGeneratedColumn()
  TID: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => STUDENT, (student) => student.tutor)
  students: STUDENT[];
}
