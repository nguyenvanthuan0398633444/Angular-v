import { BaseDto } from '@ait/core';
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class SyncPeHistoryDto extends BaseDto {
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
