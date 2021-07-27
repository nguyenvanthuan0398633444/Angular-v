import { BaseRequest } from '@ait/core';
import { InputType, Field } from '@nestjs/graphql';
import { UserJobSettingDto } from './user-job-setting.dto';

@InputType()
export class UserJobSettingRequest extends BaseRequest {
  @Field(() => UserJobSettingDto, { nullable: true })
  condition: UserJobSettingDto;

  @Field(() => [UserJobSettingDto], { nullable: true })
  data: UserJobSettingDto[];
}
