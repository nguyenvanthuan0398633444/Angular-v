import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SyncPeHistoryDto } from './sync-pe-history.dto';

@InputType()
export class SyncPeHistoryRequest extends BaseRequest {
  @Field(() => SyncPeHistoryDto, { nullable: true })
  condition: SyncPeHistoryDto;

  @Field(() => [SyncPeHistoryDto], { nullable: true })
  data: SyncPeHistoryDto[];
}
