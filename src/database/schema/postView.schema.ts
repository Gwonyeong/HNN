import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CommonMongoSchema } from './common.schema';

export type PostViewDocument = HydratedDocument<PostView>;

@Schema({ collection: 'PostView', timestamps: true })
export class PostView extends CommonMongoSchema {
  @Prop()
  postId: number;

  @Prop()
  userId: number;
}

export const PostViewSchema = SchemaFactory.createForClass(PostView);
