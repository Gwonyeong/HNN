import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @ManyToOne(() => Post, (post) => post.id, { cascade: true })
  @JoinColumn()
  post;

  @Column({ type: 'varchar', length: 255, nullable: false })
  comment: string;
}
