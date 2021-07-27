import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserJobQueryDto, UserJobQueryDto } from './user-job-query.dto';

@InputType()
export class UserJobQueryRequest extends BaseRequest {
  @Field(() => UserJobQueryDto, { nullable: true })
  condition: UserJobQueryDto;

  @Field(() => [SaveUserJobQueryDto], { nullable: true })
  data: SaveUserJobQueryDto[];
}

