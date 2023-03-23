import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SearchPostDocument = HydratedDocument<SearchPost>;

@Schema({ collection: 'SearchPost' })
export class SearchPost {
  @Prop()
  postId: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  tags: string[];
}

export const SearchPostSchema = SchemaFactory.createForClass(SearchPost);
