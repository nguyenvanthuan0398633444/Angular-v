import { BaseEntity } from '@ait/core';
import { ObjectType, Int, Field } from '@nestjs/graphql';

@ObjectType()
export class SyncPeHistoryEntity extends BaseEntity {
  @Field(() => String, { nullable: true })
  config_key?: string;

  @Field(() => String, { nullable: true })
  database?: string;

  @Field(() => Int, { nullable: true })
  record_per_time?: number;

  @Field(() => [String], { nullable: true })
  steps?: string[];

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field(() => String, { nullable: true })
  status?: string;
}
