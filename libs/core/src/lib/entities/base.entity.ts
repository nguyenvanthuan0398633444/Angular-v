import { ID, Float, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseEntity {
  @Field(() => ID, { nullable: true })
  _key: string;

  @Field(() => String, { nullable: true })
  company: string;

  @Field(() => String, { nullable: true })
  user_id: string;

  @Field(() => Float, { nullable: true })
  create_at: number;

  @Field(() => String, { nullable: true })
  create_by: string;

  @Field(() => Float, { nullable: true })
  change_at: number;

  @Field(() => String, { nullable: true })
  change_by: string;

  @Field(() => Boolean, { nullable: true })
  del_flag: boolean;
}
