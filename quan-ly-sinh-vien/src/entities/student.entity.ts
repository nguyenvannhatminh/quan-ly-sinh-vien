import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { TUTOR } from "./tutor.entity";
import { SUBJECT } from "./subject.entity";

@Entity()
export class STUDENT {
  @PrimaryGeneratedColumn()
  SID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => TUTOR, (tutor) => tutor.students, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'tutorId' })
  tutor: TUTOR;

  @ManyToMany(() => SUBJECT, (subject) => subject.students)
  @JoinTable({ name: 'student_subjects' }) // Tự động tạo bảng trung gian kết nối Nhiều - Nhiều
  subjects: SUBJECT[];
}
