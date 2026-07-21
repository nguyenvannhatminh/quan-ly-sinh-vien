import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tutor } from '../../tutor/entities/tutor.entity';
import { Subject } from '../../subject/entities/subject.entity';

@Entity('sinh_viens')
export class SinhVien {
  @PrimaryGeneratedColumn()
  SID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  // --- CÁC CỘT MỚI ĐƯỢC THÊM VÀO CHO TÍNH NĂNG ĐIỂM SỐ ---
  @Column({ type: 'json', nullable: true })
  diemSo: any;

  @Column({ type: 'float', nullable: true })
  gpa: number;

  @Column({ nullable: true })
  xepLoai: string;
  // -----------------------------------------------------

  @ManyToOne(() => Tutor)
  @JoinColumn({ name: 'tutorId' })
  tutor: Tutor;

  @ManyToMany(() => Subject)
  @JoinTable()
  subjects: Subject[];
}
