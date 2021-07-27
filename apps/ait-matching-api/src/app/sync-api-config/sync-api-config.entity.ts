import { BaseEntity } from '@ait/core';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SyncApiConfigEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  api_url?: string;

  @Field(() => String, { nullable: true })
  http_method?: string;

  @Field(() => String, { nullable: true })
  api_key?: string;

  @Field(() => String, { nullable: true })
  database?: string;

  @Field(() => String, { nullable: true })
  params?: string;
}
