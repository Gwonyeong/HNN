import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.id, { cascade: true })
  @JoinColumn()
  post: Post;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user: User;
}
