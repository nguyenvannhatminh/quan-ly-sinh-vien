import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tutors')
export class Tutor {
  @PrimaryGeneratedColumn()
  TID: number;

  @Column()
  name: string;
}
