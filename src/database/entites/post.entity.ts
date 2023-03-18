import { Auth } from '@database/entites/auth.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MBTI, gender } from './enum/user.enum';
import { role } from './enum/auth.enum';
import { User } from './user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn()
  user;

  @Column({ type: 'varchar', length: 255, nullable: false })
  youtubeUri: string;

  @Column({ type: 'varchar', length: 128, nullable: false })
  youtubeVideoId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  youtubeVideoThumbnail: string;

  @Column({ type: 'varchar', length: 32, nullable: false })
  channelId: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  youtubeTitle: string;

  @Column({ type: 'varchar', length: 256, nullable: false })
  postTitle: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  description?: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
  })
  channelTitle: string;

  @Column({ type: 'date' })
  publishedAt: Date;

  @Column({ type: 'varchar', length: 512 })
  channelThumbnail: string;
}
