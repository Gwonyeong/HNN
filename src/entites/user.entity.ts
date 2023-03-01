import { Auth } from 'src/entites/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MBTI, gender } from './enum/enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, nullable: false, default: '미정' })
  nickname: string;

  @Column({ type: 'enum', enum: MBTI, nullable: false, default: MBTI.null })
  MBTI: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: 'default.png',
  })
  profilePicture: string;

  @Column({ type: 'enum', enum: gender, default: gender.null })
  gender: string;

  @OneToOne(() => Auth, (auth) => auth.id)
  @JoinColumn()
  auth: Auth;
}
