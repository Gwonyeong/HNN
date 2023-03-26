import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user.entity';
import { Auth } from '../auth.entity';

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn()
  id;

  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @OneToOne(() => Auth, (auth) => auth.id, { cascade: true })
  @JoinColumn()
  auth;
}
