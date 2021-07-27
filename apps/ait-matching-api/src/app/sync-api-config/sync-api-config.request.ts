import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SyncApiConfigDto } from './sync-api-config.dto';

@InputType()
export class SyncApiConfigRequest extends BaseRequest {
  @Field(() => SyncApiConfigDto, { nullable: true })
  condition: SyncApiConfigDto;

  @Field(() => [SyncApiConfigDto], { nullable: true })
  data: SyncApiConfigDto[];
}
