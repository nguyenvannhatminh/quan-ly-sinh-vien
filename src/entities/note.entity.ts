import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NOTE {
  @PrimaryGeneratedColumn()
  NOTE_ID: number;

  @Column({ length: 100 })
  TITLE: string;

  @Column('text', { nullable: true })
  CONTENT: string;

  @Column('datetime', { nullable: true })
  DEADLINE: Date;
}