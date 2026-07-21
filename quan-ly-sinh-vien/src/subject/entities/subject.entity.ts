import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subjects')
export class Subject {
  @PrimaryGeneratedColumn()
  SubID: number;

  @Column()
  name: string;
}
