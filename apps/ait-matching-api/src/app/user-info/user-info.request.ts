import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { SaveUserInfoDto } from './user-info.dto';

@InputType()
export class UserInfoRequest extends BaseRequest {
  @Field(() => [SaveUserInfoDto], { nullable: true })
  data: SaveUserInfoDto[];
}
