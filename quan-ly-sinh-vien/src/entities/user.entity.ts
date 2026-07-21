import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class USER {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;
}
