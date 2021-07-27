import { BaseDto } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SyncApiConfigDto extends BaseDto {
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
