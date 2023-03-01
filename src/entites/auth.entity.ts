import { User } from 'src/entites/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { role } from './enum/auth.enum';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 16, nullable: false, default: 'local' })
  platform: string;

  @Column({ type: 'enum', enum: role })
  role: string;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: User;
}
