import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { STUDENT } from "./student.entity";

@Entity()
export class SUBJECT {
  @PrimaryGeneratedColumn()
  SubID: number;

  @Column({ unique: true })
  subjectCode: string;

  @Column()
  name: string;

  @Column()
  credits: number;

  @ManyToMany(() => STUDENT, (student) => student.subjects)
  students: STUDENT[];
}
