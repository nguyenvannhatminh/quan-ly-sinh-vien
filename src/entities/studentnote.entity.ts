import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { STUDENT } from './student.entity';
import { NOTE } from './note.entity';

@Entity()
export class STUDENT_NOTE {
  @PrimaryColumn({ length: 10 })
  SID: string;

  @PrimaryColumn()
  NOTE_ID: number;

  @Column({ length: 20, default: 'PENDING' })
  STATUS: string;

  @ManyToOne(() => STUDENT, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'SID' })
  student: STUDENT;

  @ManyToOne(() => NOTE, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'NOTE_ID' })
  note: NOTE;
}